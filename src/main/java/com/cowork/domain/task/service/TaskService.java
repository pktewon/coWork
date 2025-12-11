package com.cowork.domain.task.service;

import com.cowork.domain.task.dto.TaskCreateRequest;
import com.cowork.domain.task.dto.TaskResponse;
import com.cowork.domain.task.dto.TaskUpdateRequest;
import com.cowork.domain.task.entity.Task;
import com.cowork.domain.task.entity.TaskPriority;
import com.cowork.domain.task.entity.TaskStatus;
import com.cowork.domain.task.repository.TaskRepository;
import com.cowork.domain.team.entity.Team;
import com.cowork.domain.team.repository.TeamMemberRepository;
import com.cowork.domain.team.repository.TeamRepository;
import com.cowork.domain.user.entity.User;
import com.cowork.domain.user.repository.UserRepository;
import com.cowork.global.exception.CustomException;
import com.cowork.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public TaskResponse createTask(String loginId, Long teamId, TaskCreateRequest request) {
        User requester = getUserByLoginId(loginId);
        Team team = getTeamById(teamId);

        validateTeamMembership(requester, team);

        User worker = null;
        if (request.getWorkerLoginId() != null) {
            worker = getUserByLoginId(request.getWorkerLoginId());
            validateTeamMembership(worker, team);
        }

        Task parent = null;
        if (request.getParentId() != null) {
            parent = taskRepository.findByIdAndDeletedAtIsNull(request.getParentId())
                    .orElseThrow(() -> new CustomException(ErrorCode.TASK_NOT_FOUND));
        }

        LocalDateTime deadline = request.getDeadline() != null 
                ? request.getDeadline().atTime(LocalTime.MAX) 
                : null;

        Task task = Task.builder()
                .team(team)
                .worker(worker)
                .parent(parent)
                .title(request.getTitle())
                .content(request.getContent())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .deadline(deadline)
                .build();

        Task savedTask = taskRepository.save(task);
        return TaskResponse.from(savedTask);
    }

    public List<TaskResponse> getTeamTasks(String loginId, Long teamId) {
        User requester = getUserByLoginId(loginId);
        Team team = getTeamById(teamId);

        validateTeamMembership(requester, team);

        List<Task> tasks = taskRepository.findAllByTeamIdAndDeletedAtIsNull(teamId);
        return tasks.stream()
                .map(TaskResponse::from)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getMyTasks(String loginId) {
        User requester = getUserByLoginId(loginId);

        List<Task> tasks = taskRepository.findAllByWorkerIdAndDeletedAtIsNull(requester.getId());
        return tasks.stream()
                .map(TaskResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse updateTask(String loginId, Long taskId, TaskUpdateRequest request) {
        User requester = getUserByLoginId(loginId);

        Task task = taskRepository.findByIdAndDeletedAtIsNull(taskId)
                .orElseThrow(() -> new CustomException(ErrorCode.TASK_NOT_FOUND));

        validateTeamMembership(requester, task.getTeam());

        if (request.getVersion() != null && !request.getVersion().equals(task.getVersion())) {
            throw new CustomException(ErrorCode.TASK_VERSION_CONFLICT);
        }

        if (request.getWorkerLoginId() != null) {
            User newWorker = getUserByLoginId(request.getWorkerLoginId());
            validateTeamMembership(newWorker, task.getTeam());
            task.assignWorker(newWorker);
        }

        try {
            LocalDateTime deadline = request.getDeadline() != null
                    ? request.getDeadline().atTime(LocalTime.MAX)
                    : null;

            task.updateTask(
                    request.getTitle(),
                    request.getContent(),
                    request.getStatus(),
                    request.getPriority(),
                    deadline
            );

            Task updatedTask = taskRepository.save(task);
            return TaskResponse.from(updatedTask);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new CustomException(ErrorCode.TASK_VERSION_CONFLICT);
        }
    }

    @Transactional
    public void deleteTask(String loginId, Long taskId) {
        User requester = getUserByLoginId(loginId);

        Task task = taskRepository.findByIdAndDeletedAtIsNull(taskId)
                .orElseThrow(() -> new CustomException(ErrorCode.TASK_NOT_FOUND));

        validateTeamMembership(requester, task.getTeam());

        task.softDelete();
        taskRepository.save(task);
    }

    public TaskResponse getTask(String loginId, Long taskId) {
        User requester = getUserByLoginId(loginId);

        Task task = taskRepository.findByIdAndDeletedAtIsNull(taskId)
                .orElseThrow(() -> new CustomException(ErrorCode.TASK_NOT_FOUND));

        validateTeamMembership(requester, task.getTeam());

        return TaskResponse.from(task);
    }

    private User getUserByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private Team getTeamById(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEAM_NOT_FOUND));
    }

    private void validateTeamMembership(User user, Team team) {
        if (!teamMemberRepository.existsByUserAndTeam(user, team)) {
            throw new CustomException(ErrorCode.NOT_TEAM_MEMBER);
        }
    }
}
