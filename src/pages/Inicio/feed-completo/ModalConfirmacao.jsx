// feed-completo/ModalConfirmacao.jsx
export default function ModalConfirmacao({ alerta, setAlerta }) {
    if (!alerta.visivel) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: '#1a1b4b',
                color: 'white',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                width: '90%',
                maxWidth: '400px'
            }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>{alerta.mensagem}</p>
                <button
                    onClick={async () => {
                        await alerta.aoConfirmar();
                        setAlerta({ visivel: false, mensagem: '', aoConfirmar: null });
                    }}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Confirmar
                </button>
                <button
                    onClick={() => setAlerta({ visivel: false, mensagem: '', aoConfirmar: null })}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
