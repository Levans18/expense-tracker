package com.expense.tracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.expense.tracker.model.User;
import com.expense.tracker.model.Category;
import com.expense.tracker.repository.CategoryRepository;
import com.expense.tracker.repository.ExpenseRepository;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Category> getCategoriesForUser(User user){
        return categoryRepository.findByUserOrGlobalIsTrue(user);
    }

    public Category getCategoryByIdForUser(Long id, User user){
        return categoryRepository.findById(id)
            .filter(c -> c.isGlobal() || (c.getUser() != null && c.getUser().getId().equals(user.getId())))
            .orElseThrow(() -> new RuntimeException("Category not found or unauthorized"));
    }

    public Category createCategory(Category category, User user)
    {
        category.setUser(user);
        category.setGlobal(false);
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id, User user) {
        
        Category category = categoryRepository.findById(id)
            .filter(cat -> cat.getUser() != null && cat.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        long usageCount = expenseRepository.countByCategoryId(id);

        if (usageCount > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category is in use by existing expenses.");
        }
    
        categoryRepository.delete(category);
    }
}
