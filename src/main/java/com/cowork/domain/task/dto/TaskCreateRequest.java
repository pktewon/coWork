package com.cowork.domain.task.dto;

import com.cowork.domain.task.entity.TaskPriority;
import com.cowork.domain.task.entity.TaskStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class TaskCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
    private String title;

    private String content;

    private TaskStatus status;

    private TaskPriority priority;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deadline;

    private String workerLoginId;

    private Long parentId;
}
