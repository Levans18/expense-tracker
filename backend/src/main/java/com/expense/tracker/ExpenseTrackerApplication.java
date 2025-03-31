package com.expense.tracker;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.expense.tracker.model.Category;
import com.expense.tracker.repository.CategoryRepository;

@SpringBootApplication
public class ExpenseTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExpenseTrackerApplication.class, args);
	}

	@Bean
	CommandLineRunner seedDefaultCategories(CategoryRepository categoryRepository) {
		return args -> {
			List<String> defaultCategories = List.of("Food", "Rent", "Transport", "Entertainment", "Utilities");

			for (String name : defaultCategories) {
				boolean exists = categoryRepository.findByName(name).isPresent();
				if (!exists) {
					Category category = new Category();
					category.setName(name);
					category.setGlobal(true);
					category.setUser(null); // explicitly mark it as a global category
					categoryRepository.save(category);
				}
			}
		};
	}
}
