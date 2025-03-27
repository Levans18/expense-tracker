package com.expense.tracker.service;

import com.expense.tracker.model.Expense;
import com.expense.tracker.model.User;
import com.expense.tracker.repository.ExpenseRepository;
import com.expense.tracker.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired 
    private UserRepository userRepository;

    public List<Expense> getExpensesByUser(User user) {
        return expenseRepository.findByUser(user);
    }
    
    public Expense createExpenseForUser(Expense expense, User user) {
        User persistentUser = userRepository.findByUsername(user.getUsername())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        expense.setUser(persistentUser);
        Expense saved = expenseRepository.save(expense);
        System.out.println("Saved expense: " + saved);
        return saved;
    }
    
    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        return expenseRepository.findById(id).map(expense -> {
            expense.setName(updatedExpense.getName());
            expense.setCategory(updatedExpense.getCategory());
            expense.setAmount(updatedExpense.getAmount());
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}