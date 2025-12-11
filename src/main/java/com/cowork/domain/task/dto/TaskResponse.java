package com.cowork.domain.task.dto;

import com.cowork.domain.task.entity.Task;
import com.cowork.domain.task.entity.TaskPriority;
import com.cowork.domain.task.entity.TaskStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TaskResponse {

    private Long id;
    private Long teamId;
    private String teamName;
    private String workerLoginId;
    private String workerNickname;
    private Long parentId;
    private String title;
    private String content;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime deadline;
    private Long version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskResponse from(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .teamId(task.getTeam().getId())
                .teamName(task.getTeam().getName())
                .workerLoginId(task.getWorker() != null ? task.getWorker().getLoginId() : null)
                .workerNickname(task.getWorker() != null ? task.getWorker().getNickname() : null)
                .parentId(task.getParent() != null ? task.getParent().getId() : null)
                .title(task.getTitle())
                .content(task.getContent())
                .status(task.getStatus())
                .priority(task.getPriority())
                .deadline(task.getDeadline())
                .version(task.getVersion())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
