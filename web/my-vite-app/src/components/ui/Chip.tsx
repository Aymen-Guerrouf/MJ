import React from 'react';

export const Chip = ({ label, color = '#95D6C2', size = 'medium' }: any) => {
  const padding = size === 'small' ? '4px 12px' : '6px 16px';
  const fontSize = size === 'small' ? '11px' : '13px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: padding,
        backgroundColor: `${color}20`,
        color: color,
        borderRadius: '12px',
        fontSize: fontSize,
        fontWeight: 500
      }}
    >
      {label}
    </span>
  );
};