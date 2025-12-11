package com.cowork.domain.task.controller;

import com.cowork.domain.task.dto.TaskCreateRequest;
import com.cowork.domain.task.dto.TaskResponse;
import com.cowork.domain.task.dto.TaskUpdateRequest;
import com.cowork.domain.task.service.TaskService;
import com.cowork.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Task", description = "Task Management API")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "업무 생성", description = "팀 내에 새로운 업무를 생성합니다.")
    @PostMapping("/api/teams/{teamId}/tasks")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long teamId,
            @Valid @RequestBody TaskCreateRequest request) {
        TaskResponse response = taskService.createTask(loginId, teamId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", response));
    }

    @Operation(summary = "팀 업무 목록 조회", description = "특정 팀의 모든 업무를 조회합니다.")
    @GetMapping("/api/teams/{teamId}/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTeamTasks(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long teamId) {
        List<TaskResponse> response = taskService.getTeamTasks(loginId, teamId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "내 담당 업무 조회", description = "로그인한 사용자가 담당하는 모든 업무를 조회합니다.")
    @GetMapping("/api/tasks/my")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(
            @AuthenticationPrincipal String loginId) {
        List<TaskResponse> response = taskService.getMyTasks(loginId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "업무 상세 조회", description = "특정 업무의 상세 정보를 조회합니다.")
    @GetMapping("/api/tasks/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long taskId) {
        TaskResponse response = taskService.getTask(loginId, taskId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "업무 수정", description = "업무의 상태, 내용 등을 수정합니다. 낙관적 락이 적용됩니다.")
    @PatchMapping("/api/tasks/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long taskId,
            @RequestBody TaskUpdateRequest request) {
        TaskResponse response = taskService.updateTask(loginId, taskId, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", response));
    }

    @Operation(summary = "업무 삭제", description = "업무를 삭제합니다. (Soft Delete)")
    @DeleteMapping("/api/tasks/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long taskId) {
        taskService.deleteTask(loginId, taskId);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
