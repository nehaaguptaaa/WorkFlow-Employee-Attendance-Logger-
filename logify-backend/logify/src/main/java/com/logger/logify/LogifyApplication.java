package com.logger.logify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class
LogifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogifyApplication.class, args);
	}

}
