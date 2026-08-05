package com.logger.logify.dto;

import com.logger.logify.enums.LeaveStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class LeaveResponse {
    private Long id;
    private String employeeName;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
    private LeaveStatus status;
    private LocalDateTime appliedOn;
    private LocalDateTime reviewedOn;
}
