import {
  ATTACHMENT_IMAGE_MEDIA_TYPES,
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_PDF_MEDIA_TYPE,
  ATTACHMENT_TEXT_EXTENSIONS,
  type AttachmentKind,
} from '@claude-office/shared';
import { ATTACHMENT_RESIZE } from '@/configs/ui.config';

export type ResizedImage = { blob: Blob; name: string; mediaType: string };

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AttachmentUtil {
  private static readonly kib = 1024;
  private static readonly mib = AttachmentUtil.kib * AttachmentUtil.kib;

  static kindOf(file: File): { kind: AttachmentKind; mediaType: string } | null {
    if ((ATTACHMENT_IMAGE_MEDIA_TYPES as readonly string[]).includes(file.type)) {
      return { kind: 'image', mediaType: file.type };
    }
    const extension = AttachmentUtil.extensionOf(file.name);
    if (file.type === ATTACHMENT_PDF_MEDIA_TYPE || extension === 'pdf') {
      return { kind: 'pdf', mediaType: ATTACHMENT_PDF_MEDIA_TYPE };
    }
    if ((ATTACHMENT_TEXT_EXTENSIONS as readonly string[]).includes(extension)) {
      return { kind: 'text', mediaType: file.type === '' ? 'text/plain' : file.type };
    }
    return null;
  }

  static limitFor(kind: AttachmentKind): number {
    return ATTACHMENT_MAX_BYTES[kind];
  }

  static formatSize(bytes: number): string {
    const { kib, mib } = AttachmentUtil;
    if (bytes >= mib) return `${(bytes / mib).toFixed(bytes >= 10 * mib ? 0 : 1)} MB`;
    if (bytes >= kib) return `${Math.round(bytes / kib)} KB`;
    return `${bytes} B`;
  }

  static extensionOf(name: string): string {
    const dot = name.lastIndexOf('.');
    return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
  }

  static withJpgExtension(name: string): string {
    const dot = name.lastIndexOf('.');
    return `${dot > 0 ? name.slice(0, dot) : name}.jpg`;
  }

  /** Standard padded base64 without the `data:...,` prefix. */
  static readBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        resolve(result.slice(result.indexOf(',') + 1));
      };
      reader.onerror = () => reject(reader.error ?? new Error('read failed'));
      reader.readAsDataURL(blob);
    });
  }

  static async resizeImage(file: File, maxBytes: number): Promise<ResizedImage> {
    const bitmap = await createImageBitmap(file);
    try {
      const longEdge = Math.max(bitmap.width, bitmap.height);
      let scale = Math.min(1, ATTACHMENT_RESIZE.maxEdge / longEdge);
      for (let attempt = 0; attempt < ATTACHMENT_RESIZE.maxAttempts; attempt += 1) {
        const blob = await AttachmentUtil.drawJpeg(bitmap, scale);
        if (blob !== null && blob.size <= maxBytes) {
          return {
            blob,
            name: AttachmentUtil.withJpgExtension(file.name),
            mediaType: 'image/jpeg',
          };
        }
        scale *= ATTACHMENT_RESIZE.shrinkFactor;
      }
      throw new Error('image still too big');
    } finally {
      bitmap.close();
    }
  }

  private static drawJpeg(bitmap: ImageBitmap, scale: number): Promise<Blob | null> {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (context === null) return Promise.resolve(null);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', ATTACHMENT_RESIZE.quality);
    });
  }
}
