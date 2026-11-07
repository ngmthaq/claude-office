const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  json: 'json',
  jsonc: 'json',
  md: 'markdown',
  mdx: 'markdown',
  css: 'css',
  scss: 'scss',
  less: 'less',
  html: 'html',
  htm: 'html',
  xml: 'xml',
  svg: 'xml',
  yml: 'yaml',
  yaml: 'yaml',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  java: 'java',
  kt: 'kotlin',
  swift: 'swift',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  php: 'php',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  sql: 'sql',
  toml: 'ini',
  ini: 'ini',
  dockerfile: 'dockerfile',
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CodeLanguageUtil {
  static fromPath(path: string): string {
    const name = path.slice(path.lastIndexOf('/') + 1).toLowerCase();
    const dot = name.lastIndexOf('.');
    const key = dot === -1 ? name : name.slice(dot + 1);
    return LANGUAGE_BY_EXTENSION[key] ?? 'plaintext';
  }
}
