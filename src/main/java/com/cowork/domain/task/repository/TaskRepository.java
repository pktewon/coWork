package com.cowork.domain.task.repository;

import com.cowork.domain.task.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByTeamIdAndDeletedAtIsNull(Long teamId);

    List<Task> findAllByWorkerIdAndDeletedAtIsNull(Long workerId);

    Optional<Task> findByIdAndDeletedAtIsNull(Long id);

    List<Task> findAllByParentIdAndDeletedAtIsNull(Long parentId);
}
