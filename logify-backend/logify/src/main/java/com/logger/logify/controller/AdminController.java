package com.logger.logify.controller;

import com.logger.logify.dto.*;
import com.logger.logify.enums.LeaveStatus;
import com.logger.logify.enums.Role;
import com.logger.logify.service.AttendanceService;
import com.logger.logify.service.LeaveRequestService;
import com.logger.logify.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin", description = "Admin-only endpoints for managing employees, attendance, and leaves")
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final AttendanceService attendanceService;
    private final LeaveRequestService leaveRequestService;

    // Promote an employee to ADMIN role
    @PutMapping("/employees/{id}/promote")
    public ResponseEntity<UserResponse> promoteToAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(userService.changeUserRole(id, Role.ADMIN));
    }

    //to vview list of emp
    @GetMapping("/employees")
    public ResponseEntity<List<UserResponse>> getAllEmployees() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    //to view a particular emp
    @GetMapping("/employees/{id}")
    public ResponseEntity<UserResponse> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    //to delete any emp
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Employee deleted successfully.");
    }

    //to update attendance of any emp
    @PutMapping("/attendance/{id}")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceUpdateRequest request) {
        return ResponseEntity.ok(attendanceService.updateAttendance(
                id, request.getCheckInTime(), request.getCheckOutTime(), request.getStatus()));
    }

    //to view all the attendance of all emp
    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceResponse>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }


    //to view attendance of a particular view
    @GetMapping("/attendance/user/{userId}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByUserId(userId));
    }



    //for admin to aprrove or reject
    @PutMapping("/leave/{id}/status")
    public ResponseEntity<LeaveResponse> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam LeaveStatus status) {
        return ResponseEntity.ok(leaveRequestService.updateLeaveStatus(id, status));
    }

    // to view the summary data report
    @GetMapping("/reports/summary")
    public ResponseEntity<List<EmployeeAttendanceSummary>> getMonthlySummary(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(attendanceService.getMonthlySummary(month, year));
    }
    // to view leave requests (optionally filtered by status)
    @GetMapping("/leave")
    public ResponseEntity<List<LeaveResponse>> getLeaves(
            @RequestParam(required = false) LeaveStatus status) {
        return ResponseEntity.ok(leaveRequestService.getLeaves(status));
    }
}