package com.cowork.domain.user.service;

import com.cowork.domain.user.dto.LoginRequest;
import com.cowork.domain.user.dto.LoginResponse;
import com.cowork.domain.user.dto.SignupRequest;
import com.cowork.domain.user.dto.UserResponse;
import com.cowork.domain.user.entity.User;
import com.cowork.domain.user.entity.UserRole;
import com.cowork.domain.user.repository.UserRepository;
import com.cowork.global.exception.CustomException;
import com.cowork.global.exception.ErrorCode;
import com.cowork.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public UserResponse signup(SignupRequest request) {
        // 중복 검증
        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new CustomException(ErrorCode.DUPLICATE_LOGIN_ID);
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }

        // 비밀번호 암호화 및 User 생성
        User user = User.builder()
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .role(UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }

    public LoginResponse login(LoginRequest request) {
        // 사용자 조회
        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        // JWT 토큰 생성
        String token = jwtUtil.createToken(user.getLoginId(), user.getRole().name());
        return LoginResponse.of(token);
    }

    public UserResponse getUserByLoginId(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return UserResponse.from(user);
    }
}
