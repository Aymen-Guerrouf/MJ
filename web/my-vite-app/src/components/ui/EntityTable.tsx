import React from 'react';

export const EntityTable = ({ columns, data, loading, onEdit, onDelete }: any) => {
  const buttonStyle = (color: string, bgHover: string) => ({
    padding: '6px 12px',
    fontSize: '12px',
    border: `1px solid ${color}`,
    color: color,
    backgroundColor: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textTransform: 'none' as const
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8F9FA' }}>
            {columns.map((col: any, idx: number) => (
              <th
                key={idx}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  color: '#2C3E50',
                  ...(col.hideOnMobile && window.innerWidth < 768 ? { display: 'none' } : {})
                }}
              >
                {col.label}
              </th>
            ))}
            <th
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
                color: '#2C3E50'
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}
              >
                Chargement...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}
              >
                Aucune donnée
              </td>
            </tr>
          ) : (
            data.map((row: any) => (
              <tr
                key={row._id}
                style={{
                  borderBottom: '1px solid #E0E0E0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {columns.map((col: any, idx: number) => (
                  <td
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      ...(col.hideOnMobile && window.innerWidth < 768 ? { display: 'none' } : {})
                    }}
                  >
                    {col.render ? col.render(row) : row[col.field]}
                  </td>
                ))}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onEdit(row)}
                      style={buttonStyle('#95D6C2', '#F1FDF0')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F1FDF0';
                        e.currentTarget.style.borderColor = '#7bc4b0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#95D6C2';
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => onDelete(row._id)}
                      style={buttonStyle('#e74c3c', '#fee')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee';
                        e.currentTarget.style.borderColor = '#c0392b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#e74c3c';
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
