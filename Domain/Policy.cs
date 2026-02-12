
using System.ComponentModel.DataAnnotations;

namespace PolicyDemo.Domain;

/// <summary>
/// Domain model representing an insurance policy.
/// Contains the main properties and a small business operation to cancel a policy.
/// </summary>
public class Policy
{
    [Key]
    public int PolicyNumber { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsCancelled { get; set; }
    public DateTime? CancelledDate { get; set; }

    /// <summary>
    /// Marks the policy as cancelled and records the cancellation timestamp.
    /// Throws exception if the policy is already cancelled to protect domain invariants.
    /// </summary>
    /// <param name="cancelledDate">UTC timestamp for the cancellation event.</param>
    public void Cancel(DateTime cancelledDate)
    {
        if (IsCancelled)
            throw new InvalidOperationException("Policy already cancelled.");

        IsCancelled = true;
        CancelledDate = cancelledDate;
    }
}
