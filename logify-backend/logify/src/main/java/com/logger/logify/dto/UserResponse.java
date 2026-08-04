package com.logger.logify.dto;

import com.logger.logify.enums.Department;
import com.logger.logify.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private Long id;

    private String name;

    private String email;

    private Role role;

    private Department department;
}
