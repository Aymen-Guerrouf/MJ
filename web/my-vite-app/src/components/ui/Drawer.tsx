import React from 'react';

export const Drawer = ({ open, onClose, width, children }: any) => {
  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1200
          }}
          onClick={onClose}
        />
      )}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: width,
          backgroundColor: '#FAFAFA',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1300,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }}
      >
        {children}
      </div>
    </>
  );
};