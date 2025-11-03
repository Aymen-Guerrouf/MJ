import React from 'react';

export const Sidebar = ({ menuItems, activeSection, onItemClick, onLogout }: any) => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAFAFA' }}>
      <div
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid #E0E0E0'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#2C3E50' }}>
          Admin Centre Jeunesse
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {menuItems.map((item: any, index: number) => (
          <div
            key={index}
            onClick={() => onItemClick(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '8px',
              backgroundColor: activeSection === item.section ? '#95D6C2' : 'transparent',
              color: activeSection === item.section ? '#fff' : '#2C3E50',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeSection !== item.section) {
                e.currentTarget.style.backgroundColor = '#F1FDF0';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== item.section) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: activeSection === item.section ? 600 : 500 }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #E0E0E0' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e74c3c',
            backgroundColor: 'transparent',
            color: '#e74c3c',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee';
            e.currentTarget.style.borderColor = '#c0392b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e74c3c';
          }}
        >
          <span>🚪</span>
          <span>Se Déconnecter</span>
        </button>
      </div>
    </div>
  );
};