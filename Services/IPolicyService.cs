using PolicyDemo.Domain;

namespace PolicyDemo.Services
{
    /// <summary>
    /// Service contract for policy-related business operations.
    /// The implementation encapsulates data access and domain logic so controllers remain thin.
    /// </summary>
    public interface IPolicyService
    {
        /// <summary>
        /// Returns all policies ordered for display.
        /// Asynchronously retrieves a list from the in-memory database.
        /// </summary>
        Task<IEnumerable<Policy>> GetPoliciesAsync();

        /// <summary>
        /// Adds a new policy to the in-memory database. The service assigns a new PolicyNumber.
        /// </summary>
        Task<Policy> AddPolicyAsync(Policy newPolicy);

        /// <summary>
        /// Attempts to cancel the policy identified by policyNumber.
        /// Returns the updated policy on success or throws exception on error (not found/invalid state).
        /// </summary>
        Task<Policy> CancelPolicyAsync(int policyNumber);
    }
}
