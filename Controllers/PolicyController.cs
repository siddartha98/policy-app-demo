
using Microsoft.AspNetCore.Mvc;
using PolicyDemo.Services;

namespace PolicyDemo.Controllers;

[ApiController]
[Route("api/policies")]
public class PolicyController : ControllerBase
{
    private readonly IPolicyService _policyService;
    private readonly ILogger<PolicyController> _logger;

    // Controller receives the service and a logger from DI; controller actions remain thin.
    public PolicyController(IPolicyService policyService, ILogger<PolicyController> logger)
    {
        _policyService = policyService;
        _logger = logger;
    }

    /// <summary>
    /// GET api/policies
    /// Returns the current list of policies. Controller translates service results to HTTP.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPolicies()
    {
        try
        {
            var result = await _policyService.GetPoliciesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            // Log and return a BadRequest with the error message for simplicity.
            _logger.LogError(ex.Message);
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// PUT api/policies/{policyNumber}/cancel
    /// Attempts to cancel the specified policy and returns the updated resource.
    /// </summary>
    [HttpPut("{policyNumber}/cancel")]
    public async Task<IActionResult> CancelPolicy(int policyNumber)
    {
        try
        {
            var result = await _policyService.CancelPolicyAsync(policyNumber);
            return Ok(result);
        }
        catch (Exception ex)
        {
            // Controller converts exceptions to client-friendly HTTP responses.
            _logger.LogError(ex.Message);
            return BadRequest(ex.Message);
        }
    }
}
