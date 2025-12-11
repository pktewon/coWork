package com.cowork.domain.comment.controller;

import com.cowork.domain.comment.dto.CommentCreateRequest;
import com.cowork.domain.comment.dto.CommentResponse;
import com.cowork.domain.comment.service.CommentService;
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

@Tag(name = "Comment", description = "Comment API")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "댓글 작성", description = "특정 업무에 댓글을 작성합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long taskId,
            @Valid @RequestBody CommentCreateRequest request) {
        CommentResponse response = commentService.createComment(loginId, taskId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment created successfully", response));
    }

    @Operation(summary = "댓글 목록 조회", description = "특정 업무의 모든 댓글을 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long taskId) {
        List<CommentResponse> response = commentService.getComments(loginId, taskId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
