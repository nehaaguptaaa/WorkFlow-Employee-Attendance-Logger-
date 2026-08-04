package com.logger.logify.dto;

import com.logger.logify.enums.Department;
import com.logger.logify.enums.Role;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,20}$",
            message = "Password must be 8-20 characters and contain at least one uppercase letter, one digit, and one special character."
    )
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    @NotNull(message = "Department is required")
    private Department department;
}
