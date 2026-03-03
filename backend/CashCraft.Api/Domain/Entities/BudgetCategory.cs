                                                                                                                                                                                                                                                                                using System;
using System.Collections.Generic;

namespace CashCraft.Api.Domain.Entities
{
    public class BudgetCategory
    {
        public Guid Id { get; set; }
        public Guid BudgetPlanId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ColorHex { get; set; } = "#2e7d32";
        public decimal BudgetedAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public BudgetPlan? BudgetPlan { get; set; }
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}


