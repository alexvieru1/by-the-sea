'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ro">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#111827', marginBottom: '1rem' }}>
              A apărut o eroare
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Ne cerem scuze pentru inconveniență. Te rugăm să încerci din nou.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                backgroundColor: '#111827',
                color: '#ffffff',
                padding: '1rem 2rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Încearcă din nou
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
