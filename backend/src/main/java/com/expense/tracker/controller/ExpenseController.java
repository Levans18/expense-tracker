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

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses(@AuthenticationPrincipal User user) {
        return expenseService.getExpensesByUser(user);
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense,
                                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser(); // unwrap the real JPA user
        Expense saved = expenseService.createExpenseForUser(expense, user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}