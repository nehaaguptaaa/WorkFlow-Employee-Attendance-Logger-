package com.logger.logify.repository;

import com.logger.logify.entity.LeaveRequest;
import com.logger.logify.entity.User;
import com.logger.logify.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    // All leave requests of a user
    List<LeaveRequest> findByUser(User user);

    // Filter by status
    List<LeaveRequest> findByStatus(LeaveStatus status);

    // User's leave requests by status
    List<LeaveRequest> findByUserAndStatus(User user, LeaveStatus status);
}
