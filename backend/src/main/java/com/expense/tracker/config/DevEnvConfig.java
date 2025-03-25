package com.expense.tracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
@PropertySource("classpath:env.properties")
public class DevEnvConfig {} //All of this is to allow env.properties to be used in dev