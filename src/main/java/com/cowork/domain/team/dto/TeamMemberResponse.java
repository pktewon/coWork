package com.cowork.domain.team.dto;

import com.cowork.domain.team.entity.TeamMember;
import com.cowork.domain.team.entity.TeamRole;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TeamMemberResponse {

    private Long id;
    private String loginId;
    private String nickname;
    private TeamRole role;
    private LocalDateTime joinedAt;

    public static TeamMemberResponse from(TeamMember teamMember) {
        return TeamMemberResponse.builder()
                .id(teamMember.getId())
                .loginId(teamMember.getUser().getLoginId())
                .nickname(teamMember.getUser().getNickname())
                .role(teamMember.getRole())
                .joinedAt(teamMember.getCreatedAt())
                .build();
    }
}
