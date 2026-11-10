import { IconButton } from '@/components/atoms/IconButton';
import { SCROLL_TO_BOTTOM_LABEL } from '@/configs/ui.config';

type ScrollToBottomButtonProps = { visible: boolean; onClick: () => void };

export function ScrollToBottomButton({ visible, onClick }: ScrollToBottomButtonProps) {
  if (!visible) return null;
  return (
    <div className="scroll-to-bottom">
      <IconButton
        icon="arrow-down"
        label={SCROLL_TO_BOTTOM_LABEL}
        variant="secondary"
        className="rounded-circle"
        onClick={onClick}
      />
    </div>
  );
}
