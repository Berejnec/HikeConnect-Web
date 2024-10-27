using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Reviews
{
    public class Create
    {

        public class Command : IRequest<Result<Unit>>
        {
            public CreateReviewDto Review { get; set; }
            public Guid ActivityId { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Review.Rating).NotEmpty().GreaterThan(0).LessThan(6);
                RuleFor(x => x.Review.Description).NotEmpty().MaximumLength(500);
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync(request.ActivityId);

                if (activity == null) return null;

                var user = await context.Users
                    .Include(p => p.Photos)
                    .SingleOrDefaultAsync(u => u.UserName == userAccessor.GetUsername());

                var review = new Review
                {
                    Author = user,
                    Activity = activity,
                    Description = request.Review.Description,
                    Rating = request.Review.Rating
                };

                activity.Reviews.Add(review);

                var success = await context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to add review!");
            }
        }
    }
}