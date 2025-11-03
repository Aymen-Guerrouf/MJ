import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', icon, fullWidth = false }: any) => {
  const getStyles = () => {
    const base = {
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      width: fullWidth ? '100%' : 'auto'
    };

    if (variant === 'primary') {
      return {
        ...base,
        backgroundColor: '#95D6C2',
        color: 'white'
      };
    }

    if (variant === 'outlined') {
      return {
        ...base,
        backgroundColor: 'transparent',
        border: '1px solid #95D6C2',
        color: '#95D6C2'
      };
    }

    if (variant === 'danger') {
      return {
        ...base,
        backgroundColor: 'transparent',
        border: '1px solid #e74c3c',
        color: '#e74c3c'
      };
    }

    return base;
  };

  return (
    <button
      onClick={onClick}
      style={getStyles()}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = '#7bc4b0';
        } else if (variant === 'outlined') {
          e.currentTarget.style.backgroundColor = '#F1FDF0';
        } else if (variant === 'danger') {
          e.currentTarget.style.backgroundColor = '#fee';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = '#95D6C2';
        } else {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
