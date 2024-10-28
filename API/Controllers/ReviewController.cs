using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Reviews;

namespace API.Controllers
{
    public class ReviewController : BaseApiController
    {
        [HttpPost("{activityId}")]
        public async Task<IActionResult> CreateReview(Guid activityId, [FromBody] CreateReviewDto review)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Review = review, ActivityId = activityId }));
        }

        [HttpGet("{activityId}")]
        public async Task<IActionResult> GetReviews(Guid activityId)
        {
            return HandleResult(await Mediator.Send(new List.Query { ActivityId = activityId }));
        }
    }
}