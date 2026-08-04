package com.logger.logify.controller;

import com.logger.logify.dto.AttendanceResponse;
import com.logger.logify.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/checkin")
    public ResponseEntity<AttendanceResponse> checkIn() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(attendanceService.checkIn(email));
    }

    @PostMapping("/checkout")
    public ResponseEntity<AttendanceResponse> checkOut() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(attendanceService.checkOut(email));
    }
}
