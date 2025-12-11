package com.cowork.domain.task.dto;

import com.cowork.domain.task.entity.TaskPriority;
import com.cowork.domain.task.entity.TaskStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class TaskUpdateRequest {

    private String title;

    private String content;

    private TaskStatus status;

    private TaskPriority priority;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deadline;

    private String workerLoginId;

    private Long version;
}
