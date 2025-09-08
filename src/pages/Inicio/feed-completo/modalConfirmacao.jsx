// feed-completo/ModalConfirmacao.jsx
export default function ModalConfirmacao({ alerta, setAlerta }) {
    if (!alerta.visivel) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p className="modal-mensagem">{alerta.mensagem}</p>

                <button
                    onClick={async () => {
                        await alerta.aoConfirmar();
                        setAlerta({ visivel: false, mensagem: '', aoConfirmar: null });
                    }}
                    className="modal-botao modal-confirmar"
                >
                    Confirmar
                </button>

                <button
                    onClick={() => setAlerta({ visivel: false, mensagem: '', aoConfirmar: null })}
                    className="modal-botao modal-cancelar"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );

}
