package com.expense.tracker.service;

import com.expense.tracker.model.Expense;
import com.expense.tracker.model.User;
import com.expense.tracker.repository.ExpenseRepository;
import com.expense.tracker.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public Expense updateExpenseForUser(Long id, Expense updatedExpense, User user) {
        Expense existingExpense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
    
        if (!existingExpense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this expense");
        }
    
        existingExpense.setName(updatedExpense.getName());
        existingExpense.setCategory(updatedExpense.getCategory());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setDate(updatedExpense.getDate());
    
        return expenseRepository.save(existingExpense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Map<String, Double> getMonthlyTotalsByCategory(User user){
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate lastDayOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

        List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, firstDayOfMonth, lastDayOfMonth);

        return expenses.stream()
                .collect(Collectors.groupingBy(
                    e -> e.getCategory().getName(),
                    Collectors.summingDouble(Expense::getAmount)
                ));
    }
}