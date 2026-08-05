package com.logger.logify.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
    public class LeaveApplyRequest {
        @NotNull(message = "From date is required")
        private LocalDate fromDate;

        @NotNull(message = "To date is required")
        private LocalDate toDate;

        @NotBlank(message = "Reason is required")
        private String reason;
    }
