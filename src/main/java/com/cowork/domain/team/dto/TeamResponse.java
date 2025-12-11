package com.cowork.domain.team.dto;

import com.cowork.domain.team.entity.Team;
import com.cowork.domain.team.entity.TeamRole;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TeamResponse {

    private Long id;
    private String name;
    private String description;
    private TeamRole myRole;
    private LocalDateTime createdAt;

    public static TeamResponse from(Team team, TeamRole myRole) {
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .myRole(myRole)
                .createdAt(team.getCreatedAt())
                .build();
    }

    public static TeamResponse from(Team team) {
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .createdAt(team.getCreatedAt())
                .build();
    }
}
