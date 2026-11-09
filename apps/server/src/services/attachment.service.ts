import type { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';
import {
  ATTACHMENT_IMAGE_MEDIA_TYPES,
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_MAX_FILES,
  ATTACHMENT_MAX_TOTAL_BYTES,
  ATTACHMENT_PDF_MEDIA_TYPE,
  ATTACHMENT_TEXT_EXTENSIONS,
  type AttachmentInfo,
  type AttachmentUpload,
} from '@claude-office/shared';
import { ATTACHED_FILE_TAG, ATTACHED_FILE_TAG_PREFIX } from '@/configs/limits.config.ts';

type ContentBlock = Exclude<SDKUserMessage['message']['content'], string>[number];

export type PrepareResult =
  { ok: true; blocks: ContentBlock[]; info: AttachmentInfo[] } | { ok: false; message: string };

type Checked = { ok: true; block: ContentBlock } | { ok: false; message: string };

export class AttachmentService {
  private static readonly mb = 1024 * 1024;
  private static readonly textExtensions: ReadonlySet<string> = new Set(ATTACHMENT_TEXT_EXTENSIONS);
  private static readonly imageTypes: ReadonlySet<string> = new Set(ATTACHMENT_IMAGE_MEDIA_TYPES);

  prepare(attachments: readonly AttachmentUpload[]): PrepareResult {
    if (attachments.length > ATTACHMENT_MAX_FILES) {
      return { ok: false, message: `Too many files (limit ${ATTACHMENT_MAX_FILES}).` };
    }
    const blocks: ContentBlock[] = [];
    const info: AttachmentInfo[] = [];
    let total = 0;
    for (const file of attachments) {
      const bytes = Buffer.from(file.data, 'base64');
      if (bytes.toString('base64') !== file.data) {
        return { ok: false, message: `"${file.name}" has invalid data.` };
      }
      total += bytes.length;
      if (total > ATTACHMENT_MAX_TOTAL_BYTES) {
        return {
          ok: false,
          message: `The files are too big together (limit ${AttachmentService.formatMb(ATTACHMENT_MAX_TOTAL_BYTES)}).`,
        };
      }
      const checked = AttachmentService.check(file, bytes);
      if (!checked.ok) return checked;
      blocks.push(checked.block);
      info.push({
        name: file.name,
        mediaType: file.mediaType,
        kind: file.kind,
        size: bytes.length,
      });
    }
    return { ok: true, blocks, info };
  }

  private static check(file: AttachmentUpload, bytes: Buffer): Checked {
    const limit = ATTACHMENT_MAX_BYTES[file.kind];
    if (bytes.length > limit) {
      return {
        ok: false,
        message: `"${file.name}" is too big (limit ${AttachmentService.formatMb(limit)}).`,
      };
    }
    if (file.kind === 'text') return AttachmentService.checkText(file, bytes);
    return AttachmentService.checkBinary(file, bytes);
  }

  private static checkBinary(file: AttachmentUpload, bytes: Buffer): Checked {
    const { kind, mediaType, name } = file;
    const supported =
      kind === 'image'
        ? AttachmentService.imageTypes.has(mediaType)
        : mediaType === ATTACHMENT_PDF_MEDIA_TYPE;
    if (!supported) {
      return { ok: false, message: `"${name}" has a type that is not supported.` };
    }
    if (!AttachmentService.hasSignature(mediaType, bytes)) {
      return { ok: false, message: `"${name}" does not match its file type.` };
    }
    const source = { type: 'base64' as const, data: file.data };
    if (kind === 'image') {
      return {
        ok: true,
        block: {
          type: 'image',
          source: {
            ...source,
            media_type: mediaType as (typeof ATTACHMENT_IMAGE_MEDIA_TYPES)[number],
          },
        },
      };
    }
    return {
      ok: true,
      block: { type: 'document', source: { ...source, media_type: 'application/pdf' } },
    };
  }

  private static checkText(file: AttachmentUpload, bytes: Buffer): Checked {
    const extension = file.name.includes('.') ? (file.name.split('.').pop() ?? '') : '';
    if (!AttachmentService.textExtensions.has(extension.toLowerCase())) {
      return { ok: false, message: `"${file.name}" has a file type that is not supported.` };
    }
    let content: string;
    try {
      content = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
      return { ok: false, message: `"${file.name}" is not valid UTF-8 text.` };
    }
    const name = AttachmentService.escapeAttribute(file.name);
    return {
      ok: true,
      block: {
        type: 'text',
        text: `${ATTACHED_FILE_TAG_PREFIX}name="${name}">\n${content}\n</${ATTACHED_FILE_TAG}>`,
      },
    };
  }

  private static hasSignature(mediaType: string, bytes: Buffer): boolean {
    const startsWith = (bytesToMatch: number[], offset = 0): boolean =>
      bytesToMatch.every((value, index) => bytes[offset + index] === value);
    const ascii = (text: string, offset = 0): boolean =>
      startsWith(
        [...text].map((char) => char.charCodeAt(0)),
        offset,
      );
    switch (mediaType) {
      case 'image/png':
        return startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      case 'image/jpeg':
        return startsWith([0xff, 0xd8, 0xff]);
      case 'image/gif':
        return ascii('GIF87a') || ascii('GIF89a');
      case 'image/webp':
        return ascii('RIFF') && ascii('WEBP', 8);
      case ATTACHMENT_PDF_MEDIA_TYPE:
        return ascii('%PDF-');
      default:
        return false;
    }
  }

  private static escapeAttribute(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  private static formatMb(bytes: number): string {
    const { mb } = AttachmentService;
    return `${Number.isInteger(bytes / mb) ? bytes / mb : (bytes / mb).toFixed(2)} MB`;
  }
}
