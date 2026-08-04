package com.logger.logify.controller;

import com.logger.logify.dto.AttendanceResponse;
import com.logger.logify.dto.AttendanceUpdateRequest;
import com.logger.logify.dto.UserResponse;
import com.logger.logify.enums.Role;
import com.logger.logify.service.AttendanceService;
import com.logger.logify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final AttendanceService attendanceService;

    // AdminController for creating admin
    @PutMapping("/employees/{id}/promote")
    public ResponseEntity<UserResponse> promoteToAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(userService.changeUserRole(id, Role.ADMIN));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<UserResponse>> getAllEmployees() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<UserResponse> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Employee deleted successfully.");
    }


    @PutMapping("/attendance/{id}")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceUpdateRequest request) {
        return ResponseEntity.ok(attendanceService.updateAttendance(
                id, request.getCheckInTime(), request.getCheckOutTime(), request.getStatus()));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceResponse>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }


    @GetMapping("/attendance/user/{userId}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByUserId(userId));
    }
}