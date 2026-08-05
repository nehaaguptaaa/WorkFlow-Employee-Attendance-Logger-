package com.logger.logify.service;

import com.logger.logify.dto.LeaveApplyRequest;
import com.logger.logify.dto.LeaveResponse;
import com.logger.logify.entity.LeaveRequest;
import com.logger.logify.entity.User;
import com.logger.logify.enums.LeaveStatus;
import com.logger.logify.exception.InvalidRequestException;
import com.logger.logify.exception.ResourceNotFoundException;
import com.logger.logify.repository.LeaveRequestRepository;
import com.logger.logify.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class LeaveRequestService {
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    //for emp to apply for leave
    public LeaveResponse applyLeave(String email, LeaveApplyRequest request) {
        // 1. User fetch karo email se
        User user = userRepository.findByEmail(email)
                .orElseThrow( ()-> new ResourceNotFoundException("User does not exists!"));

        // 2. Validate: agar toDate, fromDate se pehle hai, exception throw karo
        if(request.getToDate().isBefore(request.getFromDate())){
            throw new InvalidRequestException("To date cannot be before From date.");
        }

        // 3. LeaveRequest entity banao:
        LeaveRequest leaveRequest = LeaveRequest.builder()
                .user(user)
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .appliedOn(LocalDateTime.now())
                .build();
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);

        // 5. mapToLeaveResponse() se convert karke return karo
        return mapToLeaveResponse(savedRequest);


    }

    //for emp to get all leaves
    public List<LeaveResponse> getMyLeaves(String email) {
        // 1. User fetch karo
        User user = userRepository.findByEmail(email)
                .orElseThrow( ()-> new ResourceNotFoundException("User does not exists!"));

        // 2. leaveRequestRepository.findByUser(user) call karo
        List<LeaveRequest> requests = leaveRequestRepository.findByUser(user);
        // 3. Stream + map + collect pattern use karo (jaisa AttendanceService mein kiya tha)
       return  requests.stream()
                .map((r)->mapToLeaveResponse(r))
                .toList();

    }

    // for admin to see leaves
    public List<LeaveResponse> getLeaves(LeaveStatus status) {
        List<LeaveRequest> requests = (status != null)
                ? leaveRequestRepository.findByStatus(status)
                : leaveRequestRepository.findAll();

        return requests.stream()
                .map(this::mapToLeaveResponse)
                .toList();
    }

    //for admin to update status of leave request
    public LeaveResponse updateLeaveStatus(Long leaveId, LeaveStatus newStatus) {

        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + leaveId));

        if (newStatus != LeaveStatus.APPROVED && newStatus != LeaveStatus.REJECTED) {
            throw new InvalidRequestException("Status must be APPROVED or REJECTED");
        }

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new InvalidRequestException("This leave request has already been " + leaveRequest.getStatus());
        }

        leaveRequest.setStatus(newStatus);
        leaveRequest.setReviewedOn(LocalDateTime.now());

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);
        return mapToLeaveResponse(updated);
    }

    //utility method
    private LeaveResponse mapToLeaveResponse(LeaveRequest leaveRequest) {

        LeaveResponse response = new LeaveResponse();

        response.setId(leaveRequest.getId());
        response.setEmployeeName(leaveRequest.getUser().getName());
        response.setFromDate(leaveRequest.getFromDate());
        response.setToDate(leaveRequest.getToDate());
        response.setReason(leaveRequest.getReason());
        response.setStatus(leaveRequest.getStatus());
        response.setAppliedOn(leaveRequest.getAppliedOn());
        response.setReviewedOn(leaveRequest.getReviewedOn());

        return response;
    }
}
