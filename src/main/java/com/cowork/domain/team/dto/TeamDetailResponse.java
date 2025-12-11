package com.cowork.domain.team.dto;

import com.cowork.domain.team.entity.Team;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TeamDetailResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private List<TeamMemberResponse> members;

    public static TeamDetailResponse of(Team team, List<TeamMemberResponse> members) {
        return TeamDetailResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .createdAt(team.getCreatedAt())
                .members(members)
                .build();
    }
}
