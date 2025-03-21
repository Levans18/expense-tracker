package com.expense.tracker.security;

import com.expense.tracker.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // If you're not using roles, return empty list
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // Ensure your User model has getPassword()
    }

    @Override
    public String getUsername() {
        return user.getUsername(); // Ensure your User model has getUsername()
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}