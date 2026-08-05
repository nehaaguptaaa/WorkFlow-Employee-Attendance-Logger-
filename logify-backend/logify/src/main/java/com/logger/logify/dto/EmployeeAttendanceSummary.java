package com.logger.logify.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EmployeeAttendanceSummary {
    private String employeeName;
    private long totalPresent;
    private long totalAbsent;
    private long totalLate;
}