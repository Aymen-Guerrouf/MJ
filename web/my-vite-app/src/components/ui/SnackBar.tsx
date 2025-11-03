import React from 'react';

export const Snackbar = ({ open, message, severity, onClose }: any) => {
  if (!open) return null;

  const colors = {
    success: { bg: '#D1FAE5', color: '#047857', border: '#10B981' },
    error: { bg: '#FEE2E2', color: '#DC2626', border: '#EF4444' }
  };

  const style = colors[severity] || colors.success;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: style.bg,
        color: style.color,
        padding: '16px 24px',
        borderRadius: '8px',
        border: `1px solid ${style.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 1400,
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease'
      }}
    >
      <span style={{ fontSize: '20px' }}>{severity === 'success' ? '✓' : '✕'}</span>
      <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          border: 'none',
          background: 'none',
          color: style.color,
          cursor: 'pointer',
          fontSize: '18px',
          padding: '4px'
        }}
      >
        ✕
      </button>
    </div>
  );
};