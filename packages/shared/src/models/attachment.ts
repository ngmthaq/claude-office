import { z } from 'zod';

const MB = 1024 * 1024;

export const ATTACHMENT_MAX_FILES = 10;
export const ATTACHMENT_MAX_BYTES = {
  image: 3.75 * MB,
  pdf: 20 * MB,
  text: 1 * MB,
} as const;
export const ATTACHMENT_MAX_TOTAL_BYTES = 20 * MB;
export const ATTACHMENT_IMAGE_MEDIA_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
] as const;
export const ATTACHMENT_PDF_MEDIA_TYPE = 'application/pdf';
export const ATTACHMENT_TEXT_EXTENSIONS = [
  'txt',
  'md',
  'json',
  'csv',
  'ts',
  'tsx',
  'js',
  'jsx',
  'mjs',
  'cjs',
  'py',
  'rb',
  'go',
  'rs',
  'java',
  'kt',
  'swift',
  'c',
  'h',
  'cpp',
  'hpp',
  'cs',
  'php',
  'sh',
  'zsh',
  'bash',
  'sql',
  'html',
  'css',
  'scss',
  'xml',
  'yaml',
  'yml',
  'toml',
  'ini',
  'log',
  'vue',
  'svelte',
] as const;

export const AttachmentKindSchema = z.enum(['image', 'pdf', 'text']);
export type AttachmentKind = z.infer<typeof AttachmentKindSchema>;

export const AttachmentUploadSchema = z.object({
  name: z.string().min(1).max(255),
  mediaType: z.string().min(1),
  kind: AttachmentKindSchema,
  size: z.number().int().nonnegative(),
  data: z.string().min(1),
});
export type AttachmentUpload = z.infer<typeof AttachmentUploadSchema>;

export const AttachmentInfoSchema = z.object({
  name: z.string(),
  mediaType: z.string(),
  kind: AttachmentKindSchema,
  size: z.number(),
});
export type AttachmentInfo = z.infer<typeof AttachmentInfoSchema>;
