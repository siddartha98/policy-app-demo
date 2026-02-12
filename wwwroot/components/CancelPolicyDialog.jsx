const { useEffect, useState } = React;

function ConfirmDialog({ open, title, message, busy, onConfirm, onClose }) {
    if (!open) return null;
    return (
        <div role="dialog" aria-modal="true" style={{
            position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)', zIndex: 1200
        }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: 18, maxWidth: 520, width: '92%', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <strong>{title}</strong>
                    <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ marginTop: 10, color: '#333' }}>{message}</div>

                <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} disabled={busy} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={busy} style={{ padding: '6px 10px', borderRadius: 6, background: '#e04b4b', color: '#fff', border: 'none', cursor: 'pointer' }}>
                        {busy ? 'Cancelling…' : 'Confirm Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
}