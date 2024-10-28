using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Reviews
{
    public class List
    {
        public class Query : IRequest<Result<List<ReviewDto>>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ReviewDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<ReviewDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activityReviews = await context.Reviews.Where(x => x.Activity.Id == request.ActivityId)
                    .ProjectTo<ReviewDto>(mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<ReviewDto>>.Success(activityReviews);
            }
        }
    }
}