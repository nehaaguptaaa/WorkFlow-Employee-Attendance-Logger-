package com.logger.logify.service;

import com.logger.logify.dto.AttendanceResponse;
import com.logger.logify.dto.EmployeeAttendanceSummary;
import com.logger.logify.entity.Attendance;
import com.logger.logify.entity.Settings;
import com.logger.logify.entity.User;
import com.logger.logify.enums.AttendanceStatus;
import com.logger.logify.enums.Role;
import com.logger.logify.exception.DuplicateResourceException;
import com.logger.logify.exception.ResourceNotFoundException;
import com.logger.logify.repository.AttendanceRepository;
import com.logger.logify.repository.SettingsRepository;
import com.logger.logify.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final SettingsRepository settingsRepository;

    public AttendanceResponse checkIn(String email) {

        //fetch user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        //from that user fetch attendance
        attendanceRepository.findByUserAndDate(user, LocalDate.now())
                .ifPresent(attendance -> {
                    throw new DuplicateResourceException("Attendance already marked for today.");
                });

        LocalTime checkInTime = LocalTime.now();
        // late - check in check from settings table
        LocalTime lateThreshold = getLateThreshold();

        AttendanceStatus status = checkInTime.isAfter(lateThreshold)
                ? AttendanceStatus.LATE
                : AttendanceStatus.PRESENT;

        Attendance attendance = Attendance.builder()
                .user(user)
                .date(LocalDate.now())
                .checkInTime(checkInTime)
                .status(status)
                .build();

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return mapToResponse(savedAttendance, "Checked in successfully");
    }


    public AttendanceResponse checkOut(String email) {

        // Fetch user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with email: " + email));

        // Find today's attendance
        Attendance attendance = attendanceRepository
                .findByUserAndDate(user, LocalDate.now())
                .orElseThrow(() ->
                        new ResourceNotFoundException("No check-in found for today"));

        // Prevent duplicate checkout

        if (attendance.getCheckOutTime() != null) {
            throw new DuplicateResourceException("You have already checked out today.");
        }

        // Set checkout time
        attendance.setCheckOutTime(LocalTime.now());

        // Update attendance
        Attendance savedAttendance = attendanceRepository.save(attendance);

        return mapToResponse(savedAttendance, "Checked out successfully");
    }

    private AttendanceResponse mapToResponse(Attendance attendance, String message) {
        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        response.setEmployeeName(attendance.getUser().getName());
        response.setDate(attendance.getDate());
        response.setCheckInTime(attendance.getCheckInTime());
        response.setCheckOutTime(attendance.getCheckOutTime());
        response.setStatus(attendance.getStatus());
        return response;
    }
    //utility method for late check in

    private LocalTime getLateThreshold() {
        return settingsRepository.findBySettingKey("late_threshold")
                .map(settings -> LocalTime.parse(settings.getSettingValue()))
                .orElse(LocalTime.of(9, 30));  // default fallback
    }

    // admin wanted to update any attendance
    public AttendanceResponse updateAttendance(Long attendanceId, LocalTime checkInTime, LocalTime checkOutTime, AttendanceStatus status) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + attendanceId));

        if (checkInTime != null) attendance.setCheckInTime(checkInTime);
        if (checkOutTime != null) attendance.setCheckOutTime(checkOutTime);
        if (status != null) attendance.setStatus(status);

        Attendance updated = attendanceRepository.save(attendance);
        return mapToResponse(updated, "Attendance updated by admin");
    }
    //this is for emp to watch all his attendance history
    public List<AttendanceResponse> getMyAttendanceHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        List<Attendance> records = attendanceRepository.findByUser(user);

        return records.stream()
                .map(attendance -> mapToResponse(attendance, null))  // message null, list mein zaroorat nahi
                .collect(Collectors.toList());
    }

    // for admin to see all attendance
    public List<AttendanceResponse> getAllAttendance() {
        List<Attendance> records = attendanceRepository.findAll();
        return records.stream()
                .map(attendance -> mapToResponse(attendance, null))
                .collect(Collectors.toList());
    }

    //for admin to see particular emp attendance
    public List<AttendanceResponse> getAttendanceByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return attendanceRepository.findByUser(user)
                .stream()
                .map(attendance -> mapToResponse(attendance, null))
                .collect(Collectors.toList());
    }

    // automatic absent mark
    @Scheduled(cron = "0 59 23 * * *")   // roz raat 11:59 PM
    public void markAbsentees() {
        List<User> allEmployees = userRepository.findByRole(Role.EMPLOYEE);

        for (User employee : allEmployees) {
            boolean alreadyMarked = attendanceRepository.findByUserAndDate(employee, LocalDate.now()).isPresent();

            if (!alreadyMarked) {
                Attendance absentRecord = Attendance.builder()
                        .user(employee)
                        .date(LocalDate.now())
                        .status(AttendanceStatus.ABSENT)
                        .build();
                attendanceRepository.save(absentRecord);
            }
        }
    }

    // attendance summary admin ko dikhane k liye
    public List<EmployeeAttendanceSummary> getMonthlySummary(int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<User> allEmployees = userRepository.findByRole(Role.EMPLOYEE);

        return allEmployees.stream()
                .map(employee -> {
                    List<Attendance> records = attendanceRepository.findByUserAndDateBetween(employee, start, end);

                    long present = records.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
                    long absent = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
                    long late = records.stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();

                    return new EmployeeAttendanceSummary(employee.getName(), present, absent, late);
                })
                .toList();
    }
}