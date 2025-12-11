package com.cowork.domain.team.controller;

import com.cowork.domain.team.dto.*;
import com.cowork.domain.team.service.TeamService;
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

@Tag(name = "Team", description = "Team Management API")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @Operation(summary = "팀 생성", description = "새로운 팀을 생성합니다. 생성자는 자동으로 LEADER가 됩니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<TeamResponse>> createTeam(
            @AuthenticationPrincipal String loginId,
            @Valid @RequestBody TeamCreateRequest request) {
        TeamResponse response = teamService.createTeam(loginId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team created successfully", response));
    }

    @Operation(summary = "내 팀 목록 조회", description = "로그인한 사용자가 속한 모든 팀 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamResponse>>> getMyTeams(
            @AuthenticationPrincipal String loginId) {
        List<TeamResponse> response = teamService.getMyTeams(loginId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "멤버 초대", description = "팀에 새로운 멤버를 초대합니다.")
    @PostMapping("/{teamId}/invite")
    public ResponseEntity<ApiResponse<TeamMemberResponse>> inviteMember(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long teamId,
            @Valid @RequestBody InviteRequest request) {
        TeamMemberResponse response = teamService.inviteMember(loginId, teamId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Member invited successfully", response));
    }

    @Operation(summary = "팀 멤버 목록 조회", description = "특정 팀의 모든 멤버를 조회합니다.")
    @GetMapping("/{teamId}/members")
    public ResponseEntity<ApiResponse<List<TeamMemberResponse>>> getTeamMembers(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long teamId) {
        List<TeamMemberResponse> response = teamService.getTeamMembers(loginId, teamId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "팀 상세 조회", description = "팀 상세 정보와 멤버 목록을 조회합니다.")
    @GetMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamDetailResponse>> getTeamDetail(
            @AuthenticationPrincipal String loginId,
            @PathVariable Long teamId) {
        TeamDetailResponse response = teamService.getTeamDetail(teamId, loginId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
