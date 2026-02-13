// AddPolicyDialog.jsx
// Small in-browser modal used to create a new policy.
// - Props:
//    open: boolean - whether the dialog is visible
//    template: optional policy-like object used to pre-fill fields
//    busy: boolean - disables actions while a request is in-flight
//    onClose: function - called to dismiss the dialog without action
//    onConfirm: function - called with the new policy object when user submits
//
// Notes:
// - The component manages local input state for customer name and dates.
// - Dates are normalized to ISO strings when submitted so the server receives
//   a consistent format (UTC timestamps).
// - Returns null when not open to avoid rendering or focus traps.
const { useEffect, useState } = React;

function AddPolicyDialog({ open, template, busy, onClose, onConfirm }) {
    const [customerName, setCustomerName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // The effect here syncs local state from the optional template when the dialog opens or template changes.
    useEffect(() => {
        if (open && template) {
            // template.* values are used to pre-populate the inputs for quick creation.
            setCustomerName(template.customerName || template.customerName || template.customerName);
            setStartDate(template.startDate ? new Date(template.startDate).toISOString().slice(0, 10) : '');
            setEndDate(template.endDate ? new Date(template.endDate).toISOString().slice(0, 10) : '');
        }
        else if (open) {
            // Clear fields when opened without a template.
            setCustomerName('');
            setStartDate('');
            setEndDate('');
        }
    }, [open, template]);

    // If the dialog is closed do not render anything.
    if (!open) return null;

    // Prepare the payload with data and invoke onConfirm.
    const submit = () => {
        onConfirm({
            customerName: customerName.trim(),
            // Converts date-only input back to an ISO timestamp; null indicates no date.
            startDate: startDate ? new Date(startDate).toISOString() : null,
            endDate: endDate ? new Date(endDate).toISOString() : null
        });
    };

    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal">
                <h3>Add Policy</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label className="field">
                        Customer name
                        <input value={customerName} onChange={e => setCustomerName(e.target.value)} />
                    </label>
                    <label className="field">
                        Start date
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </label>
                    <label className="field">
                        End date
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </label>
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} disabled={busy}>Cancel</button>
                    <button onClick={submit} disabled={busy || !customerName} className="add">
                        {busy ? 'Adding…' : 'Add'}
                    </button>
                </div>
            </div>

            <style>{`
                .modal-backdrop {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.35);
                    z-index: 60;
                }
                .modal {
                    background: #fff;
                    padding: 18px;
                    border-radius: 8px;
                    min-width: 320px;
                    max-width: 520px;
                    width: 90%;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                }
                .modal .field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    width: 100%;
                }
                .modal .field span {
                    font-size: 0.95rem;
                    color: #333;
                }
                .modal input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 8px 10px;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    font-size: 0.95rem;
                }
                @media (max-width: 420px) {
                    .modal {
                        padding: 14px;
                    }
                    .modal input {
                        padding: 8px;
                    }
                }
            `}</style>
        </div>
    );
}