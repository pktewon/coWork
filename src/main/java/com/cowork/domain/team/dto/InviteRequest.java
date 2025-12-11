package com.cowork.domain.team.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InviteRequest {

    @NotBlank(message = "Login ID is required")
    private String loginId;
}
