package com.cowork.domain.task.entity;

import com.cowork.domain.team.entity.Team;
import com.cowork.domain.user.entity.User;
import com.cowork.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Task extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private User worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Task parent;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    private LocalDateTime deadline;

    @Version
    private Long version;

    private LocalDateTime deletedAt;

    public void updateTask(String title, String content, TaskStatus status, TaskPriority priority, LocalDateTime deadline) {
        if (title != null) this.title = title;
        if (content != null) this.content = content;
        if (status != null) this.status = status;
        if (priority != null) this.priority = priority;
        if (deadline != null) this.deadline = deadline;
    }

    public void assignWorker(User worker) {
        this.worker = worker;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }
}
