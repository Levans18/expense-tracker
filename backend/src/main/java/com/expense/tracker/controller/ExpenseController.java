package com.expense.tracker.controller;

import com.expense.tracker.model.Expense;
import com.expense.tracker.model.User;
import com.expense.tracker.security.CustomUserDetails;
import com.expense.tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense,
                                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser(); // unwrap the real JPA user
        Expense saved = expenseService.createExpenseForUser(expense, user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping()
    public List<Expense> getAllExpenses(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        return expenseService.getExpensesByUser(user);
    }

    @GetMapping("/month-category-summary")
    public Map<String, Double> getMonthlyCategorySummary(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return expenseService.getMonthlyTotalsByCategory(userDetails.getUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, 
                                                 @RequestBody Expense expense, 
                                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        Expense updated = expenseService.updateExpenseForUser(id, expense, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}