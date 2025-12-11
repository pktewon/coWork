package com.cowork.domain.comment.service;

import com.cowork.domain.comment.dto.CommentCreateRequest;
import com.cowork.domain.comment.dto.CommentResponse;
import com.cowork.domain.comment.entity.Comment;
import com.cowork.domain.comment.repository.CommentRepository;
import com.cowork.domain.task.entity.Task;
import com.cowork.domain.task.repository.TaskRepository;
import com.cowork.domain.team.repository.TeamMemberRepository;
import com.cowork.domain.user.entity.User;
import com.cowork.domain.user.repository.UserRepository;
import com.cowork.global.exception.CustomException;
import com.cowork.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Transactional
    public CommentResponse createComment(String loginId, Long taskId, CommentCreateRequest request) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Task task = taskRepository.findByIdAndDeletedAtIsNull(taskId)
                .orElseThrow(() -> new CustomException(ErrorCode.TASK_NOT_FOUND));

        // 멤버십 검증
        if (!teamMemberRepository.existsByUserAndTeam(user, task.getTeam())) {
            throw new CustomException(ErrorCode.NOT_TEAM_MEMBER);
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .task(task)
                .writer(user)
                .build();

        Comment savedComment = commentRepository.save(comment);

        return CommentResponse.from(savedComment);
    }

    public List<CommentResponse> getComments(String loginId, Long taskId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Task task = taskRepository.findByIdAndDeletedAtIsNull(taskId)
                .orElseThrow(() -> new CustomException(ErrorCode.TASK_NOT_FOUND));

        // 멤버십 검증
        if (!teamMemberRepository.existsByUserAndTeam(user, task.getTeam())) {
            throw new CustomException(ErrorCode.NOT_TEAM_MEMBER);
        }

        List<Comment> comments = commentRepository.findAllByTaskIdOrderByCreatedAtAsc(taskId);

        return comments.stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
    }
}
