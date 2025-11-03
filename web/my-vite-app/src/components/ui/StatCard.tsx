
export const StatCard = ({ title, value, icon, color }: any) => (
  <div
    style={{
      height: '100%',
      background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
      border: '1px solid #E0E0E0',
      borderRadius: '12px',
      padding: '24px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div
        style={{
          backgroundColor: `${color}15`,
          padding: '12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </div>
    </div>
    <div
      style={{
        fontSize: '11px',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: 500,
        marginBottom: '8px'
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: '32px', fontWeight: 700, color: '#2C3E50' }}>
      {value}
    </div>
  </div>
);