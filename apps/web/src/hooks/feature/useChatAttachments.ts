import { useCallback } from 'react';
import {
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_MAX_FILES,
  ATTACHMENT_MAX_TOTAL_BYTES,
  type AttachmentUpload,
} from '@claude-office/shared';
import { ATTACHMENT_TEXT } from '@/configs/ui.config';
import type { AttachmentDraft } from '@/dtos/attachment-draft.dto';
import { NO_ATTACHMENTS, useChatDraftStore } from '@/hooks/store/useChatDraftStore';
import { AttachmentUtil } from '@/utils/attachment.util';

let nextAttachmentId = 0;

export function useChatAttachments(roomId: string | null) {
  const drafts = useChatDraftStore((state) =>
    roomId === null ? NO_ATTACHMENTS : (state.byRoom[roomId]?.attachments ?? NO_ATTACHMENTS),
  );
  const sending = useChatDraftStore((state) =>
    roomId === null ? false : (state.byRoom[roomId]?.sending ?? false),
  );
  const setSending = useCallback(
    (value: boolean) => {
      if (roomId !== null) useChatDraftStore.getState().setSending(roomId, value);
    },
    [roomId],
  );

  const patch = useCallback((forRoom: string, id: string, change: Partial<AttachmentDraft>) => {
    useChatDraftStore.getState().patchAttachment(forRoom, id, change);
  }, []);

  const load = useCallback(
    async (forRoom: string, draft: AttachmentDraft, file: File) => {
      let resizing = false;
      try {
        let blob: Blob = file;
        let change: Partial<AttachmentDraft> = {};
        if (draft.kind === 'image' && file.size > ATTACHMENT_MAX_BYTES.image) {
          resizing = true;
          const resized = await AttachmentUtil.resizeImage(file, ATTACHMENT_MAX_BYTES.image);
          blob = resized.blob;
          change = { name: resized.name, mediaType: resized.mediaType, size: resized.blob.size };
          resizing = false;
        }
        const data = await AttachmentUtil.readBase64(blob);
        patch(forRoom, draft.id, { ...change, data, status: 'ready' });
      } catch {
        const error = resizing ? ATTACHMENT_TEXT.resizeFailed : ATTACHMENT_TEXT.readFailed;
        patch(forRoom, draft.id, { status: 'error', error });
      }
    },
    [patch],
  );

  const add = useCallback(
    (files: File[]) => {
      if (roomId === null || sending || files.length === 0) return;
      const forRoom = roomId;
      const existing = drafts;
      let count = existing.filter((draft) => draft.status !== 'error').length;
      let total = existing.reduce(
        (sum, draft) => (draft.status === 'error' ? sum : sum + draft.size),
        0,
      );
      const added: { draft: AttachmentDraft; file: File | null }[] = files.map((file) => {
        nextAttachmentId += 1;
        const id = `att-${nextAttachmentId}`;
        const info = AttachmentUtil.kindOf(file);
        const base = { id, name: file.name, size: file.size };
        if (info === null) {
          const draft: AttachmentDraft = {
            ...base,
            kind: 'text',
            mediaType: file.type,
            status: 'error',
            error: ATTACHMENT_TEXT.typeNotSupported,
          };
          return { draft, file: null };
        }
        const reject = (error: string) => ({
          draft: { ...base, ...info, status: 'error' as const, error },
          file: null,
        });
        const limit = AttachmentUtil.limitFor(info.kind);
        const resizable = info.kind === 'image' && info.mediaType !== 'image/gif';
        if (file.size === 0) return reject(ATTACHMENT_TEXT.empty);
        if (file.size > limit && !resizable) {
          return reject(`${ATTACHMENT_TEXT.tooBig} (limit ${AttachmentUtil.formatSize(limit)})`);
        }
        if (count >= ATTACHMENT_MAX_FILES) return reject(ATTACHMENT_TEXT.tooMany);
        const counted = resizable ? Math.min(file.size, limit) : file.size;
        if (total + counted > ATTACHMENT_MAX_TOTAL_BYTES) {
          return reject(ATTACHMENT_TEXT.totalOver);
        }
        count += 1;
        total += counted;
        return { draft: { ...base, ...info, status: 'reading' as const }, file };
      });
      useChatDraftStore.getState().addAttachments(
        forRoom,
        added.map((a) => a.draft),
      );
      for (const { draft, file } of added) {
        if (file !== null) void load(forRoom, draft, file);
      }
    },
    [load, drafts, roomId, sending],
  );

  const remove = useCallback(
    (id: string) => {
      if (roomId !== null) useChatDraftStore.getState().removeAttachment(roomId, id);
    },
    [roomId],
  );

  const uploads: AttachmentUpload[] = drafts.flatMap((draft) =>
    draft.status === 'ready' && draft.data !== undefined
      ? [
          {
            name: draft.name,
            mediaType: draft.mediaType,
            kind: draft.kind,
            size: draft.size,
            data: draft.data,
          },
        ]
      : [],
  );

  return {
    drafts,
    uploads,
    reading: drafts.some((draft) => draft.status === 'reading'),
    sending,
    setSending,
    add,
    remove,
  };
}

export type ChatAttachments = ReturnType<typeof useChatAttachments>;
