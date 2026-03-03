using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CashCraft.Api.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public QuizzesController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var query = _db.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(qq => qq.Options)
                .AsQueryable();

            // Only show published quizzes to non-admin users
            var userRole = User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value
                ?? User.FindFirst("role")?.Value
                ?? User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role")?.Value;
            
            Console.WriteLine($"[QuizzesController] User authenticated: {User.Identity?.IsAuthenticated}");
            Console.WriteLine($"[QuizzesController] User role: {userRole}");
            Console.WriteLine($"[QuizzesController] All claims: {string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}"))}");
            
            if (userRole?.ToLower() != "admin" && userRole?.ToLower() != "editor")
            {
                Console.WriteLine("[QuizzesController] Filtering to published quizzes only");
                query = query.Where(q => q.IsPublished);
            }
            else
            {
                Console.WriteLine("[QuizzesController] Showing all quizzes (admin/editor)");
            }

            var items = await query
                .OrderByDescending(q => q.PublishedAt ?? q.CreatedAt)
                .ToListAsync();
            
            Console.WriteLine($"[QuizzesController] Returning {items.Count} quizzes");
            
            // Return clean DTOs without circular references
            var result = items.Select(quiz => new
            {
                id = quiz.Id,
                slug = quiz.Slug,
                titleEn = quiz.TitleEn,
                titleAr = quiz.TitleAr,
                isPublished = quiz.IsPublished,
                publishedAt = quiz.PublishedAt,
                createdAt = quiz.CreatedAt,
                questions = quiz.Questions.Select(q => new
                {
                    id = q.Id,
                    textEn = q.TextEn,
                    textAr = q.TextAr,
                    options = q.Options.Select(o => new
                    {
                        id = o.Id,
                        textEn = o.TextEn,
                        textAr = o.TextAr,
                        isCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            }).ToList();
            
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _db.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(qq => qq.Options)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (item == null) return NotFound();
            
            // Return clean DTO without circular references
            var result = new
            {
                id = item.Id,
                slug = item.Slug,
                titleEn = item.TitleEn,
                titleAr = item.TitleAr,
                isPublished = item.IsPublished,
                publishedAt = item.PublishedAt,
                createdAt = item.CreatedAt,
                questions = item.Questions.Select(q => new
                {
                    id = q.Id,
                    textEn = q.TextEn,
                    textAr = q.TextAr,
                    options = q.Options.Select(o => new
                    {
                        id = o.Id,
                        textEn = o.TextEn,
                        textAr = o.TextAr,
                        isCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };
            
            return Ok(result);
        }

        public class CreateQuizRequest
        {
            public string Slug { get; set; } = string.Empty;
            public string TitleEn { get; set; } = string.Empty;
            public string TitleAr { get; set; } = string.Empty;
            public List<CreateQuizQuestion> Questions { get; set; } = new();
        }

        public class CreateQuizQuestion
        {
            public string TextEn { get; set; } = string.Empty;
            public string TextAr { get; set; } = string.Empty;
            public List<CreateQuizOption> Options { get; set; } = new();
        }

        public class CreateQuizOption
        {
            public string TextEn { get; set; } = string.Empty;
            public string TextAr { get; set; } = string.Empty;
            public bool IsCorrect { get; set; }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Create([FromBody] CreateQuizRequest req)
        {
            var quiz = new Quiz
            {
                Id = Guid.NewGuid(),
                Slug = req.Slug,
                TitleEn = req.TitleEn,
                TitleAr = req.TitleAr,
                IsPublished = false, // Always create as private
                PublishedAt = null,
                Questions = req.Questions.Select(q => new QuizQuestion
                {
                    Id = Guid.NewGuid(),
                    TextEn = q.TextEn,
                    TextAr = q.TextAr,
                    Options = q.Options.Select(o => new QuizOption
                    {
                        Id = Guid.NewGuid(),
                        TextEn = o.TextEn,
                        TextAr = o.TextAr,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            _db.Quizzes.Add(quiz);
            await _db.SaveChangesAsync();
            
            // Return a clean DTO without circular references
            var result = new
            {
                id = quiz.Id,
                slug = quiz.Slug,
                titleEn = quiz.TitleEn,
                titleAr = quiz.TitleAr,
                isPublished = quiz.IsPublished,
                publishedAt = quiz.PublishedAt,
                createdAt = quiz.CreatedAt,
                questions = quiz.Questions.Select(q => new
                {
                    id = q.Id,
                    textEn = q.TextEn,
                    textAr = q.TextAr,
                    options = q.Options.Select(o => new
                    {
                        id = o.Id,
                        textEn = o.TextEn,
                        textAr = o.TextAr,
                        isCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };
            
            return Created($"api/quizzes/{quiz.Id}", result);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateQuizRequest req)
        {
            var quiz = await _db.Quizzes.FindAsync(id);
            
            if (quiz == null) return NotFound();

            quiz.Slug = req.Slug;
            quiz.TitleEn = req.TitleEn;
            quiz.TitleAr = req.TitleAr;

            // Delete all old questions and options using raw queries to avoid tracking issues
            var oldQuestions = await _db.QuizQuestions.Where(q => q.QuizId == id).ToListAsync();
            if (oldQuestions.Any())
            {
                var questionIds = oldQuestions.Select(q => q.Id).ToList();
                var oldOptions = await _db.QuizOptions.Where(o => questionIds.Contains(o.QuestionId)).ToListAsync();
                
                _db.QuizOptions.RemoveRange(oldOptions);
                _db.QuizQuestions.RemoveRange(oldQuestions);
                await _db.SaveChangesAsync();
            }

            // Add new questions and options
            foreach (var questionReq in req.Questions)
            {
                var question = new QuizQuestion
                {
                    Id = Guid.NewGuid(),
                    TextEn = questionReq.TextEn,
                    TextAr = questionReq.TextAr,
                    QuizId = quiz.Id
                };
                _db.QuizQuestions.Add(question);
                
                foreach (var optionReq in questionReq.Options)
                {
                    var option = new QuizOption
                    {
                        Id = Guid.NewGuid(),
                        TextEn = optionReq.TextEn,
                        TextAr = optionReq.TextAr,
                        IsCorrect = optionReq.IsCorrect,
                        QuestionId = question.Id
                    };
                    _db.QuizOptions.Add(option);
                }
            }

            // Publish quiz if all questions are filled
            if (req.Questions.Count > 0 && req.Questions.All(q => 
                !string.IsNullOrEmpty(q.TextEn) && 
                !string.IsNullOrEmpty(q.TextAr) &&
                q.Options.Count >= 2 &&
                q.Options.All(o => !string.IsNullOrEmpty(o.TextEn) && !string.IsNullOrEmpty(o.TextAr))
            ))
            {
                quiz.IsPublished = true;
                quiz.PublishedAt = DateTime.UtcNow;
            }
            else
            {
                quiz.IsPublished = false;
                quiz.PublishedAt = null;
            }

            await _db.SaveChangesAsync();
            
            // Reload quiz with questions and options for response
            var updatedQuiz = await _db.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(qq => qq.Options)
                .FirstOrDefaultAsync(q => q.Id == id);
            
            // Return a clean DTO without circular references
            var result = new
            {
                id = updatedQuiz.Id,
                slug = updatedQuiz.Slug,
                titleEn = updatedQuiz.TitleEn,
                titleAr = updatedQuiz.TitleAr,
                isPublished = updatedQuiz.IsPublished,
                publishedAt = updatedQuiz.PublishedAt,
                createdAt = updatedQuiz.CreatedAt,
                questions = updatedQuiz.Questions.Select(q => new
                {
                    id = q.Id,
                    textEn = q.TextEn,
                    textAr = q.TextAr,
                    options = q.Options.Select(o => new
                    {
                        id = o.Id,
                        textEn = o.TextEn,
                        textAr = o.TextAr,
                        isCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };
            
            return Ok(result);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var quiz = await _db.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(qq => qq.Options)
                .FirstOrDefaultAsync(q => q.Id == id);
            
            if (quiz == null) return NotFound();

            _db.Quizzes.Remove(quiz);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}


