package com.cowork.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "Invalid input value"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C002", "Internal server error"),

    // Auth
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001", "Unauthorized"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "A002", "Invalid token"),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "A003", "Expired token"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "A004", "Access denied"),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "User not found"),
    DUPLICATE_LOGIN_ID(HttpStatus.CONFLICT, "U002", "Login ID already exists"),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "U003", "Nickname already exists"),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "U004", "Invalid password"),

    // Team
    TEAM_NOT_FOUND(HttpStatus.NOT_FOUND, "T001", "Team not found"),
    ALREADY_TEAM_MEMBER(HttpStatus.CONFLICT, "T002", "User is already a team member"),
    NOT_TEAM_MEMBER(HttpStatus.FORBIDDEN, "T003", "User is not a team member"),
    NOT_TEAM_LEADER(HttpStatus.FORBIDDEN, "T004", "Only team leader can perform this action"),

    // Task
    TASK_NOT_FOUND(HttpStatus.NOT_FOUND, "K001", "Task not found"),
    TASK_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "K002", "Task is already deleted"),
    TASK_VERSION_CONFLICT(HttpStatus.CONFLICT, "K003", "Task has been modified by another user"),
    WORKER_NOT_TEAM_MEMBER(HttpStatus.BAD_REQUEST, "K004", "Worker is not a team member");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
