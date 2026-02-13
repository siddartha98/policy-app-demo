// Simple enum-like object for API endpoints.
// Used functions for routes that require parameters (e.g. policyNumber).
const ApiEndpoints = Object.freeze({
    GET_POLICIES: '/api/policies',
    CREATE_POLICY: 'api/policies', // POST
    CANCEL_POLICY: (policyNumber) => `/api/policies/${policyNumber}/cancel`
});

// Exposed the enum objects globally for the in-browser UMD/Babel environment.
window.ApiEndpoints = ApiEndpoints;