package com.logger.logify.controller;

import com.logger.logify.dto.AttendanceResponse;
import com.logger.logify.dto.AttendanceUpdateRequest;
import com.logger.logify.service.AttendanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Tag(name = "Employee Attendance", description = "Endpoints for employees to check in/out and view their attendance")
@RestController
@RequestMapping("/employee/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    //for emp
    @PostMapping("/checkin")
    public ResponseEntity<AttendanceResponse> checkIn() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(attendanceService.checkIn(email));
    }

    //for emp
    @PostMapping("/checkout")
    public ResponseEntity<AttendanceResponse> checkOut() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(attendanceService.checkOut(email));
    }

    //for admin to update the attendance of any employee
    @PutMapping("/attendance/{id}")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceUpdateRequest request) {
        return ResponseEntity.ok(attendanceService.updateAttendance(
                id, request.getCheckInTime(), request.getCheckOutTime(), request.getStatus()));
    }
    // for emp to watch his attendance history
    @GetMapping("/history")
    public ResponseEntity<List<AttendanceResponse>> getMyHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(attendanceService.getMyAttendanceHistory(email));
    }
}
