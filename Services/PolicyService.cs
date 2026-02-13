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
        public PolicyService(AppDbContext context, ILogger<PolicyService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves policies from the database and orders them for UI consumption.
        /// Asynchronous and uses EF Core query operators.
        /// </summary>
        public async Task<IEnumerable<Policy>> GetPoliciesAsync()
        {
            var policies = await _context.Policies
            .OrderBy(p => p.PolicyNumber)
            .ToListAsync();

            return policies;
        }

        /// <summary>
        /// Adds a new policy. Generates a new PolicyNumber and persists the entity.
        /// </summary>
        public async Task<Policy> AddPolicyAsync(Policy newPolicy)
        {
            if (newPolicy == null)
                throw new ArgumentNullException(nameof(newPolicy));

            if (string.IsNullOrWhiteSpace(newPolicy.CustomerName))
                throw new ArgumentException("Customer name is a required field.");

            if (newPolicy.EndDate < newPolicy.StartDate)
                throw new ArgumentException("EndDate must be greater than StartDate.");

            // Assign a new PolicyNumber: if policies exist then max(existingPolicy) + 1,
            // or start at 1001 if none exist.
            var latestPolicy = _context.Policies.Any() ? _context.Policies.Max(p => p.PolicyNumber) : 1000;
            newPolicy.PolicyNumber = latestPolicy + 1;
            newPolicy.IsCancelled = false;
            newPolicy.CancelledDate = null;

            _context.Policies.Add(newPolicy);
            await _context.SaveChangesAsync();

            return newPolicy;
        }

        /// <summary>
        /// Performs validation, loads the policy, applies the domain Cancel operation,
        /// and persists changes. Throws meaningful exceptions for the controller to handle.
        /// </summary>
        public async Task<Policy> CancelPolicyAsync(int policyNumber)
        {
            if (policyNumber <= 0)
                throw new ArgumentException("Invalid policy number.", nameof(policyNumber));

            var policy = await _context.Policies.FirstOrDefaultAsync(p => p.PolicyNumber == policyNumber);

            if (policy == null)
                throw new KeyNotFoundException($"Policy {policyNumber} was not found.");

            if (policy.IsCancelled == true)
                throw new InvalidOperationException($"Policy {policyNumber} is already cancelled.");

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
