import { AttachmentChip, type AttachmentChipProps } from '@/components/atoms/AttachmentChip';

type AttachmentListItem = Omit<AttachmentChipProps, 'onRemove'> & { id?: string };

type AttachmentListProps = {
  items: AttachmentListItem[];
  onRemove?: (id: string) => void;
};

export function AttachmentList({ items, onRemove }: AttachmentListProps) {
  if (items.length === 0) return null;
  return (
    <div className="attachment-list">
      {items.map((item, index) => {
        const { id, ...chip } = item;
        return (
          <AttachmentChip
            key={id ?? `${index}-${chip.name}`}
            {...chip}
            onRemove={onRemove !== undefined && id !== undefined ? () => onRemove(id) : undefined}
          />
        );
      })}
    </div>
  );
}
