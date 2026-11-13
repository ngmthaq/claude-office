import { useEffect, useRef } from 'react';
import { DiffEditor, Editor, type DiffOnMount } from '@monaco-editor/react';
import { setupMonaco } from '@/configs/monaco.config';
import { CodeLanguageUtil } from '@/utils/code-language.util';

type CodeEditorViewProps = {
  mode: 'diff' | 'file';
  path: string;
  head: string | null;
  current: string | null;
};

type DiffEditorInstance = Parameters<DiffOnMount>[0];

setupMonaco();

type ReadOnlyDiffProps = {
  language: string;
  head: string | null;
  current: string | null;
};

function ReadOnlyDiff({ language, head, current }: ReadOnlyDiffProps) {
  const diffEditorRef = useRef<DiffEditorInstance | null>(null);

  // The library disposes the models before the diff widget releases them, which throws.
  // We detach and dispose them first; this parent cleanup runs before the library's.
  useEffect(() => {
    return () => {
      const editor = diffEditorRef.current;
      diffEditorRef.current = null;
      const models = editor?.getModel();
      if (!editor || !models) return;
      editor.setModel(null);
      models.original.dispose();
      models.modified.dispose();
    };
  }, []);

  return (
    <DiffEditor
      height="100%"
      theme="vs-dark"
      language={language}
      original={head ?? ''}
      modified={current ?? ''}
      keepCurrentOriginalModel
      keepCurrentModifiedModel
      onMount={(editor) => {
        diffEditorRef.current = editor;
      }}
      options={{
        readOnly: true,
        originalEditable: false,
        renderSideBySide: true,
        useInlineViewWhenSpaceIsLimited: false,
        automaticLayout: true,
      }}
    />
  );
}

export function CodeEditorView({ mode, path, head, current }: CodeEditorViewProps) {
  const language = CodeLanguageUtil.fromPath(path);

  if (mode === 'diff') {
    return <ReadOnlyDiff language={language} head={head} current={current} />;
  }

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={language}
      path={path}
      value={current ?? ''}
      options={{ readOnly: true, domReadOnly: true, automaticLayout: true }}
    />
  );
}
