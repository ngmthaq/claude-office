import { useMemo, useState } from 'react';
import type { FileEntry, GitFileStatus } from '@claude-office/shared';

export type FileTreeProps = {
  files: FileEntry[];
  statuses: { path: string; status: GitFileStatus }[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
};

type TreeNode = {
  name: string;
  path: string;
  kind: 'file' | 'dir';
  children: TreeNode[];
};

function buildTree(files: FileEntry[]): TreeNode[] {
  const roots: TreeNode[] = [];
  const dirs = new Map<string, TreeNode>();

  const ensureDir = (path: string): TreeNode => {
    const existing = dirs.get(path);
    if (existing) return existing;
    const slash = path.lastIndexOf('/');
    const node: TreeNode = { name: path.slice(slash + 1), path, kind: 'dir', children: [] };
    dirs.set(path, node);
    (slash === -1 ? roots : ensureDir(path.slice(0, slash)).children).push(node);
    return node;
  };

  for (const entry of files) {
    if (entry.kind === 'dir') {
      ensureDir(entry.path);
      continue;
    }
    const slash = entry.path.lastIndexOf('/');
    const node: TreeNode = {
      name: entry.path.slice(slash + 1),
      path: entry.path,
      kind: 'file',
      children: [],
    };
    (slash === -1 ? roots : ensureDir(entry.path.slice(0, slash)).children).push(node);
  }

  const sort = (nodes: TreeNode[]): void => {
    nodes.sort((a, b) =>
      a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'dir' ? -1 : 1,
    );
    for (const node of nodes) sort(node.children);
  };
  sort(roots);
  return roots;
}

export function FileTree({ files, statuses, selectedPath, onSelect }: FileTreeProps) {
  const [openDirs, setOpenDirs] = useState<Set<string>>(new Set());
  const tree = useMemo(() => buildTree(files), [files]);
  const statusByPath = useMemo(() => new Map(statuses.map((s) => [s.path, s.status])), [statuses]);
  const changedDirs = useMemo(() => {
    const result = new Set<string>();
    for (const { path } of statuses) {
      let slash = path.lastIndexOf('/');
      while (slash > 0) {
        result.add(path.slice(0, slash));
        slash = path.lastIndexOf('/', slash - 1);
      }
    }
    return result;
  }, [statuses]);

  const toggle = (path: string): void =>
    setOpenDirs((current) => {
      const next = new Set(current);
      if (!next.delete(path)) next.add(path);
      return next;
    });

  const renderNodes = (nodes: TreeNode[], depth: number): React.ReactNode =>
    nodes.map((node) => {
      const indent = { paddingLeft: `${depth * 14 + 8}px` };
      if (node.kind === 'dir') {
        const isOpen = openDirs.has(node.path);
        return (
          <div key={node.path}>
            <button
              type="button"
              className="file-tree__row"
              style={indent}
              aria-expanded={isOpen}
              onClick={() => toggle(node.path)}
              title={node.path}
            >
              <i
                className={`bi bi-chevron-${isOpen ? 'down' : 'right'} file-tree__chevron`}
                aria-hidden="true"
              />
              <span className="file-tree__name text-truncate">{node.name}</span>
              {changedDirs.has(node.path) && (
                <span className="file-tree__dot" title="Contains changes" />
              )}
            </button>
            {isOpen && renderNodes(node.children, depth + 1)}
          </div>
        );
      }
      const status = statusByPath.get(node.path);
      const selected = node.path === selectedPath;
      return (
        <button
          key={node.path}
          type="button"
          className={`file-tree__row${selected ? ' file-tree__row--selected' : ''}`}
          style={indent}
          onClick={() => onSelect(node.path)}
          title={node.path}
        >
          <i className="bi bi-file-earmark file-tree__chevron" aria-hidden="true" />
          <span
            className={`file-tree__name text-truncate${status === 'D' ? ' file-tree__name--deleted' : ''}`}
          >
            {node.name}
          </span>
          {status && <span className={`file-tree__mark file-tree__mark--${status}`}>{status}</span>}
        </button>
      );
    });

  return <div className="file-tree">{renderNodes(tree, 0)}</div>;
}
