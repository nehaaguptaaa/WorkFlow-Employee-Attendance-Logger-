package com.logger.logify.dto;

import com.logger.logify.enums.AttendanceStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class AttendanceUpdateRequest {
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private AttendanceStatus status;
}