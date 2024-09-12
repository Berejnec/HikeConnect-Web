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
namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.ActivityAttendees
                    .Where(s => s.AppUser.UserName == request.Username)
                    .OrderBy(d => d.Activity.Date)
                    .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        query = query.Where(a => a.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        query = query.Where(a => a.HostUsername == request.Username);
                        break;
                    default:
                        query = query.Where(a => a.Date >= DateTime.Now);
                        break;
                }

                var activities = await query.ToListAsync();

                return Result<List<UserActivityDto>>.Success(activities);
            }
        }
    }
}