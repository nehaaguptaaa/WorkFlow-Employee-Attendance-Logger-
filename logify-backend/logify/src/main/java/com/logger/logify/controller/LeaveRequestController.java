package com.logger.logify.controller;

import com.logger.logify.dto.LeaveApplyRequest;
import com.logger.logify.dto.LeaveResponse;
import com.logger.logify.entity.LeaveRequest;
import com.logger.logify.repository.LeaveRequestRepository;
import com.logger.logify.service.LeaveRequestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jdk.dynalink.linker.LinkerServices;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Tag(name = "Employee Leave", description = "Endpoints for employees to apply for leave and track requests")
@RestController
@AllArgsConstructor
@RequestMapping("/employee/leave")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;
    private final LeaveRequestRepository leaveRequestRepository;

    //for emp to post request
    @PostMapping("/apply")
    public ResponseEntity<LeaveResponse> applyLeave(@Valid @RequestBody LeaveApplyRequest request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(leaveRequestService.applyLeave(email,request));
    }

    //for emp to see  his leave history
    @GetMapping("/my-requests")
    public ResponseEntity<List<LeaveResponse>> getMyLeaves(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return  ResponseEntity.ok(leaveRequestService.getMyLeaves(email));
    }

}
