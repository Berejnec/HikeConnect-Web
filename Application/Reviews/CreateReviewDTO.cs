using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Reviews
{
    public class CreateReviewDto
    {
        public int Rating { get; set; }
        public string Description { get; set; }
    }

}