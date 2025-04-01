package com.expense.tracker.repository;

import com.expense.tracker.model.Expense;
import com.expense.tracker.model.User;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>{
    List<Expense> findByUser(User user);
    long countByCategoryId(Long categoryId);
    List<Expense> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}