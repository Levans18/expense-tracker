package com.expense.tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.expense.tracker.model.Category;
import com.expense.tracker.model.User;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    List<Category> findByUserOrGlobalIsTrue(User user);
    Optional<Category> findByName(String name);
}
