package com.cowork.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignupRequest {

    @NotBlank(message = "Login ID is required")
    @Size(min = 4, max = 50, message = "Login ID must be between 4 and 50 characters")
    private String loginId;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    @NotBlank(message = "Nickname is required")
    @Size(min = 2, max = 50, message = "Nickname must be between 2 and 50 characters")
    private String nickname;
}
