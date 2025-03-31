package com.expense.tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.tracker.model.User;
import com.expense.tracker.model.Category;
import com.expense.tracker.security.CustomUserDetails;
import com.expense.tracker.service.CategoryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    public List<Category> getAllCategories(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        return categoryService.getCategoriesForUser(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        Category category = categoryService.getCategoryByIdForUser(id, user);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<Category> createCustomCategory(@RequestBody Category category,
                                                         @AuthenticationPrincipal CustomUserDetails userDetails) {
        Category created = categoryService.createCategory(category, userDetails.getUser());
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        categoryService.deleteCategory(id, user);
        return ResponseEntity.ok().build();
    }
}
