import type { CanUseTool, PermissionResult } from '@anthropic-ai/claude-agent-sdk';
import type { PermissionDecision } from '@claude-office/shared';
import type { FastifyBaseLogger } from 'fastify';
import {
  ASK_IN_CHAT_MESSAGE,
  ASK_IN_CHAT_TOOLS,
  PERMISSION_DENY_MESSAGE,
  QUESTION_SKIPPED_MESSAGE,
} from '@/configs/sdk.config.ts';
import type { Session, SessionStoreRepository } from '@/repositories/session-store.repository.ts';
import type { EventBusService } from '@/services/event-bus.service.ts';
import { TextUtil } from '@/utils/text.util.ts';
import { TypeGuardUtil } from '@/utils/type-guard.util.ts';

export class PermissionService {
  constructor(
    private readonly sessionStoreRepository: SessionStoreRepository,
    private readonly eventBusService: EventBusService,
    private readonly log: FastifyBaseLogger,
  ) {}

  answerPermission(
    roomId: string,
    requestId: string,
    decision: PermissionDecision,
    answers?: Record<string, string>,
  ): void {
    const session = this.sessionStoreRepository.get(roomId);
    const pending = session?.pending.get(requestId);
    if (!session || !pending) {
      this.log.info({ roomId, requestId }, 'permission answer ignored');
      return;
    }
    if (pending.toolName === 'AskUserQuestion') {
      this.answerQuestion(session, requestId, pending.input, decision, answers);
      return;
    }
    this.log.info(
      { roomId, requestId, toolName: pending.toolName, decision },
      'permission answered',
    );
    this.settlePermission(
      session,
      requestId,
      decision === 'allow'
        ? { behavior: 'allow', updatedInput: pending.input }
        : { behavior: 'deny', message: PERMISSION_DENY_MESSAGE },
      decision,
    );
  }

  requestPermission(
    session: Session,
    toolName: string,
    input: Record<string, unknown>,
    options: Parameters<CanUseTool>[2],
  ): Promise<PermissionResult> {
    if (ASK_IN_CHAT_TOOLS.includes(toolName)) {
      return Promise.resolve({ behavior: 'deny', message: ASK_IN_CHAT_MESSAGE });
    }
    const requestId = options.toolUseID;
    return new Promise<PermissionResult>((resolve) => {
      const onAbort = (): void => this.cancelPermission(session, requestId);
      options.signal.addEventListener('abort', onAbort, { once: true });
      session.pending.set(requestId, {
        toolName,
        input,
        resolve,
        detach: () => options.signal.removeEventListener('abort', onAbort),
      });
      this.eventBusService.emit(session, {
        type: 'permission_request',
        roomId: session.id,
        requestId,
        toolName,
        ...(options.title !== undefined ? { title: options.title } : {}),
        ...(options.description !== undefined ? { description: options.description } : {}),
        input: TextUtil.cutStrings(input),
        fromSubagent: options.agentID !== undefined,
        time: Date.now(),
      });
      this.eventBusService.updateState(session);
      if (options.signal.aborted) onAbort();
    });
  }

  private answerQuestion(
    session: Session,
    requestId: string,
    input: Record<string, unknown>,
    decision: PermissionDecision,
    answers: Record<string, string> | undefined,
  ): void {
    const roomId = session.id;
    if (decision === 'deny') {
      this.log.info(
        { roomId, requestId, toolName: 'AskUserQuestion', decision },
        'question skipped',
      );
      this.settlePermission(
        session,
        requestId,
        { behavior: 'deny', message: QUESTION_SKIPPED_MESSAGE },
        decision,
      );
      return;
    }
    const invalidReason = this.findInvalidAnswersReason(input, answers);
    if (invalidReason !== null || answers === undefined) {
      this.log.info({ roomId, requestId, reason: invalidReason }, 'question answers ignored');
      return;
    }
    this.log.info(
      { roomId, requestId, toolName: 'AskUserQuestion', decision },
      'question answered',
    );
    this.settlePermission(
      session,
      requestId,
      { behavior: 'allow', updatedInput: { ...input, answers } },
      decision,
    );
  }

  private findInvalidAnswersReason(
    input: Record<string, unknown>,
    answers: Record<string, string> | undefined,
  ): string | null {
    if (answers === undefined) return 'answers missing';
    const questions = input.questions;
    if (!Array.isArray(questions)) return 'questions malformed';
    const texts: string[] = [];
    for (const item of questions) {
      const text = TypeGuardUtil.isRecord(item) ? item.question : undefined;
      if (typeof text !== 'string') return 'questions malformed';
      texts.push(text);
    }
    if (Object.keys(answers).some((key) => !texts.includes(key))) return 'unknown question';
    if (texts.some((text) => answers[text] === undefined)) return 'question unanswered';
    return null;
  }

  cancelAllPermissions(session: Session): void {
    for (const requestId of [...session.pending.keys()]) this.cancelPermission(session, requestId);
  }

  private cancelPermission(session: Session, requestId: string): void {
    this.settlePermission(
      session,
      requestId,
      { behavior: 'deny', message: PERMISSION_DENY_MESSAGE },
      'cancelled',
    );
  }

  private settlePermission(
    session: Session,
    requestId: string,
    result: PermissionResult,
    decision: PermissionDecision | 'cancelled',
  ): void {
    const pending = session.pending.get(requestId);
    if (!pending) return;
    session.pending.delete(requestId);
    pending.detach();
    pending.resolve(result);
    this.eventBusService.emit(session, {
      type: 'permission_resolved',
      roomId: session.id,
      requestId,
      decision,
    });
    this.eventBusService.updateState(session);
  }
}
