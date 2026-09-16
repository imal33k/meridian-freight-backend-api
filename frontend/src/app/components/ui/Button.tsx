import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline-light';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-cargo text-white hover:bg-cargo-dark',
  secondary: 'bg-ink text-white hover:bg-ink-700',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 border border-line',
  'outline-light': 'bg-transparent text-white border border-white/40 hover:bg-white/10',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-1.5 rounded-sm',
  md: 'text-sm px-5 py-2.5 rounded-sm',
  lg: 'text-base px-6 py-3.5 rounded-sm',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type ButtonAsLink = CommonProps & Omit<LinkProps, keyof CommonProps> & { as: 'link' };
type ButtonAsAnchor = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { as: 'a' };

type Props = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export default function Button(props: Props) {
  const { variant = 'primary', size = 'md', icon, iconPosition = 'right', fullWidth, className = '', children } = props;

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' ? icon : null}
      {children}
      {icon && iconPosition === 'right' ? icon : null}
    </>
  );

  if (props.as === 'link') {
    const { as: _as, variant: _v, size: _s, icon: _i, iconPosition: _ip, fullWidth: _fw, className: _c, children: _ch, ...linkRest } = props;
    return (
      <Link className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  if (props.as === 'a') {
    const { as: _as, variant: _v, size: _s, icon: _i, iconPosition: _ip, fullWidth: _fw, className: _c, children: _ch, ...anchorRest } = props;
    return (
      <a className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const { as: _as, variant: _v, size: _s, icon: _i, iconPosition: _ip, fullWidth: _fw, className: _c, children: _ch, ...buttonRest } = props;
  return (
    <button className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
