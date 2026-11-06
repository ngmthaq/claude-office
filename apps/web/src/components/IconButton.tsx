import Button from 'react-bootstrap/Button';
import type { ButtonProps } from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import type { Placement } from 'react-bootstrap/types';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'aria-label'> {
  icon: string;
  label: string;
  placement?: Placement;
}

export function IconButton({
  icon,
  label,
  placement = 'top',
  variant = 'outline-secondary',
  ...rest
}: IconButtonProps) {
  // An explicit `size={undefined}` means normal size; omitting it means small.
  const size = 'size' in rest ? rest.size : 'sm';
  const disabled = rest.disabled === true;
  const button = (
    <Button
      variant={variant}
      aria-label={label}
      {...rest}
      size={size}
      style={disabled ? { ...rest.style, pointerEvents: 'none' } : rest.style}
    >
      <i className={`bi bi-${icon}`} aria-hidden="true" />
    </Button>
  );
  return (
    <OverlayTrigger placement={placement} overlay={<Tooltip>{label}</Tooltip>}>
      {disabled ? (
        <span className="d-inline-block" tabIndex={0}>
          {button}
        </span>
      ) : (
        button
      )}
    </OverlayTrigger>
  );
}
