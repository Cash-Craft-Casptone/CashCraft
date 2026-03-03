using Microsoft.EntityFrameworkCore;
using CashCraft.Api.Domain.Entities;
using CashCraft.Api.Infrastructure;

namespace CashCraft.Api
{
    public class AddSampleContent
    {
        public static async Task AddSampleEducationalContent(ApplicationDbContext context)
        {
            try
            {
                Console.WriteLine("🎓 Adding sample educational content...");

                // Check if content already exists
                var existingArticles = await context.Articles.AnyAsync();
                var existingVideos = await context.Videos.AnyAsync();
                var existingQuizzes = await context.Quizzes.AnyAsync();

                if (existingArticles && existingVideos && existingQuizzes)
                {
                    Console.WriteLine("⚠️  Sample content already exists. Skipping...");
                    return;
                }

                // Add sample articles
                if (!existingArticles)
                {
                    var articles = new List<Article>
                    {
                        new Article
                        {
                            Id = Guid.NewGuid(),
                            Slug = "emergency-fund-basics",
                            TitleEn = "Emergency Fund Basics",
                            TitleAr = "أساسيات صندوق الطوارئ",
                            DescriptionEn = "Learn why you need an emergency fund and how to build one",
                            DescriptionAr = "تعلم لماذا تحتاج إلى صندوق طوارئ وكيفية بنائه",
                            BodyEn = "An emergency fund is essential for financial security...",
                            BodyAr = "صندوق الطوارئ ضروري للأمان المالي...",
                            CoverUrl = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
                            PublishedAt = DateTime.UtcNow
                        },
                        new Article
                        {
                            Id = Guid.NewGuid(),
                            Slug = "budgeting-101",
                            TitleEn = "Budgeting 101: Getting Started",
                            TitleAr = "الميزانية 101: البداية",
                            DescriptionEn = "A beginner's guide to creating and maintaining a budget",
                            DescriptionAr = "دليل المبتدئين لإنشاء والحفاظ على الميزانية",
                            BodyEn = "Creating a budget is the first step to financial freedom...",
                            BodyAr = "إنشاء ميزانية هو الخطوة الأولى نحو الحرية المالية...",
                            CoverUrl = "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
                            PublishedAt = DateTime.UtcNow
                        },
                        new Article
                        {
                            Id = Guid.NewGuid(),
                            Slug = "saving-strategies",
                            TitleEn = "Smart Saving Strategies",
                            TitleAr = "استراتيجيات الادخار الذكية",
                            DescriptionEn = "Discover effective ways to save money every month",
                            DescriptionAr = "اكتشف طرقًا فعالة لتوفير المال كل شهر",
                            BodyEn = "Saving money doesn't have to be difficult...",
                            BodyAr = "توفير المال لا يجب أن يكون صعبًا...",
                            CoverUrl = "https://images.unsplash.com/photo-1579621970795-87facc2f976d",
                            PublishedAt = DateTime.UtcNow
                        }
                    };

                    context.Articles.AddRange(articles);
                    await context.SaveChangesAsync();
                    Console.WriteLine($"✅ Added {articles.Count} sample articles");
                }

                // Add sample videos
                if (!existingVideos)
                {
                    var videos = new List<Video>
                    {
                        new Video
                        {
                            Id = Guid.NewGuid(),
                            Slug = "budgeting-basics",
                            TitleEn = "Budgeting Basics for Beginners",
                            TitleAr = "أساسيات الميزانية للمبتدئين",
                            DescriptionEn = "Learn how to create an effective budget step by step",
                            DescriptionAr = "تعلم كيفية إنشاء ميزانية فعالة خطوة بخطوة",
                            Url = "https://www.youtube.com/watch?v=sVKQn2M4rvQ",
                            ThumbnailUrl = "https://img.youtube.com/vi/sVKQn2M4rvQ/maxresdefault.jpg",
                            DurationSec = 780,
                            PublishedAt = DateTime.UtcNow
                        },
                        new Video
                        {
                            Id = Guid.NewGuid(),
                            Slug = "saving-tips",
                            TitleEn = "Smart Saving Strategies",
                            TitleAr = "استراتيجيات الادخار الذكية",
                            DescriptionEn = "Discover smart ways to save money and build wealth",
                            DescriptionAr = "اكتشف طرقًا ذكية لتوفير المال وبناء الثروة",
                            Url = "https://www.youtube.com/watch?v=HQzoZfc3GwQ",
                            ThumbnailUrl = "https://img.youtube.com/vi/HQzoZfc3GwQ/maxresdefault.jpg",
                            DurationSec = 665,
                            PublishedAt = DateTime.UtcNow
                        },
                        new Video
                        {
                            Id = Guid.NewGuid(),
                            Slug = "investing-intro",
                            TitleEn = "Introduction to Investing",
                            TitleAr = "مقدمة في الاستثمار",
                            DescriptionEn = "A beginner's guide to investing in financial markets",
                            DescriptionAr = "دليل المبتدئين للاستثمار في الأسواق المالية",
                            Url = "https://www.youtube.com/watch?v=gFQNPmLKj1k",
                            ThumbnailUrl = "https://img.youtube.com/vi/gFQNPmLKj1k/maxresdefault.jpg",
                            DurationSec = 900,
                            PublishedAt = DateTime.UtcNow
                        }
                    };

                    context.Videos.AddRange(videos);
                    await context.SaveChangesAsync();
                    Console.WriteLine($"✅ Added {videos.Count} sample videos");
                }

                // Add sample quizzes
                if (!existingQuizzes)
                {
                    var quiz1 = new Quiz
                    {
                        Id = Guid.NewGuid(),
                        Slug = "money-basics",
                        TitleEn = "Money Basics",
                        TitleAr = "أساسيات المال",
                        IsPublished = true,
                        PublishedAt = DateTime.UtcNow,
                        Questions = new List<QuizQuestion>
                        {
                            new QuizQuestion
                            {
                                Id = Guid.NewGuid(),
                                TextEn = "What is a budget?",
                                TextAr = "ما هي الميزانية؟",
                                Options = new List<QuizOption>
                                {
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "A plan for spending money", TextAr = "خطة لإنفاق المال", IsCorrect = true },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "A type of bank account", TextAr = "نوع من الحسابات المصرفية", IsCorrect = false },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "A credit card", TextAr = "بطاقة ائتمان", IsCorrect = false },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "A loan", TextAr = "قرض", IsCorrect = false }
                                }
                            },
                            new QuizQuestion
                            {
                                Id = Guid.NewGuid(),
                                TextEn = "What is an emergency fund?",
                                TextAr = "ما هو صندوق الطوارئ؟",
                                Options = new List<QuizOption>
                                {
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "Money saved for unexpected expenses", TextAr = "أموال محفوظة للنفقات غير المتوقعة", IsCorrect = true },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "Money for vacations", TextAr = "أموال للعطلات", IsCorrect = false },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "Money for shopping", TextAr = "أموال للتسوق", IsCorrect = false },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "Money for investments", TextAr = "أموال للاستثمارات", IsCorrect = false }
                                }
                            }
                        }
                    };

                    var quiz2 = new Quiz
                    {
                        Id = Guid.NewGuid(),
                        Slug = "budget-management",
                        TitleEn = "Budget Management",
                        TitleAr = "إدارة الميزانية",
                        IsPublished = true,
                        PublishedAt = DateTime.UtcNow,
                        Questions = new List<QuizQuestion>
                        {
                            new QuizQuestion
                            {
                                Id = Guid.NewGuid(),
                                TextEn = "What percentage of income should go to savings?",
                                TextAr = "ما النسبة المئوية من الدخل التي يجب أن تذهب للادخار؟",
                                Options = new List<QuizOption>
                                {
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "At least 20%", TextAr = "على الأقل 20٪", IsCorrect = true },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "5%", TextAr = "5٪", IsCorrect = false },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "50%", TextAr = "50٪", IsCorrect = false },
                                    new QuizOption { Id = Guid.NewGuid(), TextEn = "0%", TextAr = "0٪", IsCorrect = false }
                                }
                            }
                        }
                    };

                    context.Quizzes.AddRange(new[] { quiz1, quiz2 });
                    await context.SaveChangesAsync();
                    Console.WriteLine($"✅ Added 2 sample quizzes");
                }

                Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                Console.WriteLine("✅ Sample educational content added successfully!");
                Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error adding sample content: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }
    }
}
