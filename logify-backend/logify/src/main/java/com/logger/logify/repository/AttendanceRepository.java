package com.logger.logify.repository;


import com.logger.logify.entity.Attendance;
import com.logger.logify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Find attendance of a user on a particular date
    Optional<Attendance> findByUserAndDate(User user, LocalDate date);

    // Find all attendance records of a user
    List<Attendance> findByUser(User user);

    // Find attendance between two dates
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // Find attendance of a user within a date range
    List<Attendance> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
