import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
  id,
  ariaLabel,
}) => {
  const isSm = size === 'sm';

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || (checked ? 'Status is ON' : 'Status is OFF')}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange(!checked);
        }
      }}
      className={`relative inline-flex items-center rounded-full transition-all duration-300 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'
      } ${
        isSm ? 'w-[60px] h-[30px] p-[3px]' : 'w-[74px] h-[36px] p-1'
      } ${className}`}
      style={{
        backgroundColor: '#EDF1F6',
        border: '1px solid rgba(203, 213, 225, 0.7)',
        boxShadow:
          'inset 0 2px 4px rgba(0, 0, 0, 0.12), inset 0 -1px 2px rgba(255, 255, 255, 0.85), 0 1px 2px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* ON Text (visible on left when switch is ON) */}
      <span
        aria-hidden="true"
        className={`absolute font-extrabold uppercase tracking-wider text-slate-400 select-none transition-opacity duration-200 ${
          isSm ? 'left-2.5 text-[10px]' : 'left-3 text-[11px]'
        } ${checked ? 'opacity-100' : 'opacity-0'}`}
      >
        ON
      </span>

      {/* OFF Text (visible on right when switch is OFF) */}
      <span
        aria-hidden="true"
        className={`absolute font-extrabold uppercase tracking-wider text-slate-400 select-none transition-opacity duration-200 ${
          isSm ? 'right-2 text-[9.5px]' : 'right-2.5 text-[11px]'
        } ${!checked ? 'opacity-100' : 'opacity-0'}`}
      >
        OFF
      </span>

      {/* 3D Sphere Knob (Ball) */}
      <span
        aria-hidden="true"
        className={`block rounded-full transition-transform duration-300 ease-in-out shrink-0 ${
          isSm ? 'w-[24px] h-[24px]' : 'w-[28px] h-[28px]'
        }`}
        style={{
          transform: checked
            ? isSm
              ? 'translateX(30px)'
              : 'translateX(38px)'
            : 'translateX(0px)',
          background: checked
            ? 'radial-gradient(circle at 35% 30%, #4ADE80 0%, #16A34A 55%, #14532D 100%)'
            : 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #CBD5E1 55%, #94A3B8 100%)',
          boxShadow: checked
            ? 'inset 0 1.5px 2px rgba(255, 255, 255, 0.7), inset 0 -2px 3px rgba(0, 0, 0, 0.25), 0 3px 6px rgba(22, 163, 74, 0.45)'
            : 'inset 0 1.5px 2px rgba(255, 255, 255, 0.9), inset 0 -2px 3px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.2)',
        }}
      />
    </button>
  );
};

export default ToggleSwitch;
