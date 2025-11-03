import React from 'react';

export const FormDialog = ({ open, onClose, title, fields, formData, onChange, onSave, isEditing }: any) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #E0E0E0' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#2C3E50' }}>{title}</h2>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {fields.map((field: any, idx: number) => {
            if (field.type === 'select') {
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    {field.label}
                  </label>
                  <select
                    value={formData[field.name]}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="">Sélectionner...</option>
                    {field.options?.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.multiline) {
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    {field.label}
                  </label>
                  <textarea
                    value={formData[field.name]}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    rows={field.rows || 3}
                    required={field.required}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              );
            }

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                  {field.label}
                </label>
                <input
                  type={field.type || 'text'}
                  value={formData[field.name]}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E0E0E0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: '#F8F9FA'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#6B7280',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: '#95D6C2',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7bc4b0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#95D6C2';
            }}
          >
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};