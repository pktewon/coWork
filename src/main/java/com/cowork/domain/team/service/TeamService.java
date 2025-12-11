package com.cowork.domain.team.service;

import com.cowork.domain.team.dto.InviteRequest;
import com.cowork.domain.team.dto.TeamCreateRequest;
import com.cowork.domain.team.dto.TeamDetailResponse;
import com.cowork.domain.team.dto.TeamMemberResponse;
import com.cowork.domain.team.dto.TeamResponse;
import com.cowork.domain.team.entity.Team;
import com.cowork.domain.team.entity.TeamMember;
import com.cowork.domain.team.entity.TeamRole;
import com.cowork.domain.team.repository.TeamMemberRepository;
import com.cowork.domain.team.repository.TeamRepository;
import com.cowork.domain.user.entity.User;
import com.cowork.domain.user.repository.UserRepository;
import com.cowork.global.exception.CustomException;
import com.cowork.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public TeamResponse createTeam(String loginId, TeamCreateRequest request) {
        User creator = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Team savedTeam = teamRepository.save(team);

        TeamMember leaderMember = TeamMember.builder()
                .user(creator)
                .team(savedTeam)
                .role(TeamRole.LEADER)
                .build();

        teamMemberRepository.save(leaderMember);

        return TeamResponse.from(savedTeam, TeamRole.LEADER);
    }

    public List<TeamResponse> getMyTeams(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<TeamMember> memberships = teamMemberRepository.findByUser(user);

        return memberships.stream()
                .map(tm -> TeamResponse.from(tm.getTeam(), tm.getRole()))
                .collect(Collectors.toList());
    }

    @Transactional
    public TeamMemberResponse inviteMember(String loginId, Long teamId, InviteRequest request) {
        User inviter = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEAM_NOT_FOUND));

        if (!teamMemberRepository.existsByUserAndTeam(inviter, team)) {
            throw new CustomException(ErrorCode.NOT_TEAM_MEMBER);
        }

        User invitee = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (teamMemberRepository.existsByUserAndTeam(invitee, team)) {
            throw new CustomException(ErrorCode.ALREADY_TEAM_MEMBER);
        }

        TeamMember newMember = TeamMember.builder()
                .user(invitee)
                .team(team)
                .role(TeamRole.MEMBER)
                .build();

        TeamMember savedMember = teamMemberRepository.save(newMember);

        return TeamMemberResponse.from(savedMember);
    }

    public List<TeamMemberResponse> getTeamMembers(String loginId, Long teamId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEAM_NOT_FOUND));

        if (!teamMemberRepository.existsByUserAndTeam(user, team)) {
            throw new CustomException(ErrorCode.NOT_TEAM_MEMBER);
        }

        List<TeamMember> members = teamMemberRepository.findByTeam(team);

        return members.stream()
                .map(TeamMemberResponse::from)
                .collect(Collectors.toList());
    }

    public TeamDetailResponse getTeamDetail(Long teamId, String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEAM_NOT_FOUND));

        if (!teamMemberRepository.existsByUserAndTeam(user, team)) {
            throw new CustomException(ErrorCode.NOT_TEAM_MEMBER);
        }

        List<TeamMember> members = teamMemberRepository.findByTeam(team);
        List<TeamMemberResponse> memberResponses = members.stream()
                .map(TeamMemberResponse::from)
                .collect(Collectors.toList());

        return TeamDetailResponse.of(team, memberResponses);
    }
}
