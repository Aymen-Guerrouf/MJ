import React from 'react';

export const AppBar = ({ onMenuClick, title, actions }: any) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        zIndex: 1100
      }}
    >
      <button
        onClick={onMenuClick}
        style={{
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: '8px',
          marginRight: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2C3E50'
        }}
      >
        ☰
      </button>
      <h1 style={{ flex: 1, margin: 0, fontSize: '20px', fontWeight: 600, color: '#2C3E50' }}>
        {title}
      </h1>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {actions}
      </div>
    </div>
  );
};