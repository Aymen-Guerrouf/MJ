import React from 'react';

export const Card = ({ title, subtitle, actions, children }: any) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #E0E0E0',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {(title || subtitle || actions) && (
        <div style={{ padding: '24px', borderBottom: '1px solid #E0E0E0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              {title && (
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#2C3E50' }}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
};