package com.expense.tracker.repository;

import com.expense.tracker.model.Expense;
import com.expense.tracker.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>{
    List<Expense> findByUser(User user);
}