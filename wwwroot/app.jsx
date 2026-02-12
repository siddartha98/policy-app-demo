const { useEffect, useState } = React;

function formatDate(d) {
    if (!d) return '';
    try {
        return new Date(d).toLocaleDateString();
    } catch {
        return d;
    }
}

function TechBadges() {
    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginLeft: 12,
    };

    const pill = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 8px',
        borderRadius: 12,
        fontSize: '0.82rem',
        color: '#1f3a57',
        background: '#eef8ff',
        border: '1px solid #e1f2ff',
    };

    const iconStyle = { width: 14, height: 14, flex: '0 0 14px' };

    return (
        <div style={badgeStyle} aria-hidden="false">
            <div style={pill} title="React (UMD)">
                <svg style={iconStyle} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
                    <circle cx="12" cy="12" r="2" fill="#2d9cdb" />
                    <path d="M2 12c3-6 9-10 10-10s7 4 10 10c-3 6-9 10-10 10S5 18 2 12z" stroke="#2d9cdb" strokeWidth="0.7" fill="none" />
                </svg>
                React (demo)
            </div>

            <div style={pill} title=".NET 8 API">
                <svg style={iconStyle} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#6b7280" strokeWidth="1" />
                    <path d="M7 12h10M12 7v10" stroke="#6b7280" strokeWidth="1" strokeLinecap="round" />
                </svg>
                .NET 8
            </div>

            <div style={pill} title="Babel in-browser (no build)">
                <svg style={iconStyle} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
                    <path d="M12 2v20M2 12h20" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                In-Browser UI
            </div>
        </div>
    );
}

function PolicyRow({ p, onRequestCancel }) {
    return (
        <tr>
            <td>{p.policyNumber}</td>
            <td>{p.customerName}</td>
            <td>{formatDate(p.startDate)}</td>
            <td>{formatDate(p.endDate)}</td>
            <td>
                <span className={`badge ${p.isCancelled ? 'cancelled' : 'active'}`}>
                    {p.isCancelled ? 'Cancelled' : 'Active'}
                </span>
            </td>
            <td>
                <div className="row-actions">
                    {!p.isCancelled ? (
                        <button
                            className="cancel"
                            onClick={() => onRequestCancel(p)}
                            title="Cancel policy"
                        >
                            Cancel
                        </button>
                    ) : (
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>—</span>
                    )}
                </div>
            </td>
        </tr>
    );
}

function App() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busyId, setBusyId] = useState(null);

    // Confirmation dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingPolicy, setPendingPolicy] = useState(null);
    const [confirmBusy, setConfirmBusy] = useState(false);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/policies');
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `Failed to load (${res.status})`);
            }
            const data = await res.json();
            setPolicies(data);
        } catch (err) {
            setError(err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // requestCancel shows the dialog
    const requestCancel = (policy) => {
        setPendingPolicy(policy);
        setConfirmOpen(true);
    };

    // actual cancel after user confirms
    const cancelPolicy = async (id) => {
        setConfirmBusy(true);
        setError(null);
        setBusyId(id);
        try {
            const res = await fetch(`/api/policies/${id}/cancel`, { method: 'PUT' });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `Failed to cancel (${res.status})`);
            }
            const updated = await res.json().catch(() => null);
            if (updated) {
                setPolicies((prev) => prev.map(p => p.policyNumber === updated.policyNumber ? updated : p));
            } else {
                await load();
            }
            setConfirmOpen(false);
            setPendingPolicy(null);
        } catch (err) {
            setError(err.message || 'Failed to cancel policy');
        } finally {
            setConfirmBusy(false);
            setBusyId(null);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <strong>Policy list</strong>
                    <TechBadges />
                </div>
                <div>
                    <button className="refresh" onClick={load} disabled={loading}>Refresh</button>
                </div>
            </div>

            {loading ? (
                <div className="center">Loading policies…</div>
            ) : error ? (
                <div className="error">Error: {error}</div>
            ) : policies.length === 0 ? (
                <div className="center">No policies found.</div>
            ) : (
                <table aria-label="Policies">
                    <thead>
                        <tr>
                            <th>Policy Number</th>
                            <th>Customer</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(p => (
                            <PolicyRow key={p.policyNumber} p={p} onRequestCancel={(policy) => {
                                if (busyId) return;
                                requestCancel(policy);
                            }} />
                        ))}
                    </tbody>
                </table>
            )}

            <ConfirmDialog
                open={confirmOpen}
                title="Confirm Cancellation"
                message={pendingPolicy ? `Are you sure you want to cancel policy ${pendingPolicy.policyNumber} for ${pendingPolicy.customerName}? This action cannot be undone.` : ''}
                busy={confirmBusy}
                onClose={() => { if (!confirmBusy) { setConfirmOpen(false); setPendingPolicy(null); } }}
                onConfirm={() => pendingPolicy && cancelPolicy(pendingPolicy.policyNumber)}
            />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);