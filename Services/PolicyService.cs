using Microsoft.EntityFrameworkCore;
using PolicyDemo.Data;
using PolicyDemo.Domain;

namespace PolicyDemo.Services
{
    /// <summary>
    /// Concrete implementation of IPolicyService.
    /// Handles data retrieval and the cancel operation, coordinating EF Core and domain behavior.
    /// </summary>
    public class PolicyService : IPolicyService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PolicyService> _logger;

        // The constructor receives the DbContext via DI. The logger is declared for diagnostics.
        public PolicyService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves policies from the database and orders them for UI consumption.
        /// Asynchronous and uses EF Core query operators.
        /// </summary>
        public async Task<IEnumerable<Policy>> GetPoliciesAsync()
        {
            var policies = await _context.Policies
            .OrderByDescending(p => p.StartDate)
            .ToListAsync();

            return policies;
        }

        /// <summary>
        /// Performs validation, loads the policy, applies the domain Cancel operation,
        /// and persists changes. Throws meaningful exceptions for the controller to handle.
        /// </summary>
        public async Task<Policy> CancelPolicyAsync(int policyNumber)
        {
            if (policyNumber <= 0)
                throw new ArgumentException("Invalid policy number.", nameof(policyNumber));
                _logger.LogWarning($"Attempted to cancel by invalid policy number.");

            var policy = await _context.Policies.FirstOrDefaultAsync(p => p.PolicyNumber == policyNumber);

            if (policy == null)
                throw new KeyNotFoundException($"Policy {policyNumber} was not found.");
                _logger.LogWarning($"Attempted to cancel non-existent policy {policyNumber}.");

            if (policy.IsCancelled == true)
                throw new InvalidOperationException($"Policy {policyNumber} is already cancelled.");
                _logger.LogWarning($"Attempted to cancel already cancelled policy {policyNumber}.");

            try
            {
                // Use the domain model to change state so business rules are centralized.
                policy.Cancel(DateTime.UtcNow);
                await _context.SaveChangesAsync();

                return policy;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                // Convert low-level data exceptions into a clearer domain-level error.
                _logger.LogError(ex, $"Concurrency error while cancelling policy {policyNumber}.");
                throw new InvalidOperationException($"Policy {policyNumber} was modified by another process.", ex);
            }
        }
    }
}
