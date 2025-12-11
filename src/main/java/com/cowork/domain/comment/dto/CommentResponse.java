package com.cowork.domain.comment.dto;

import com.cowork.domain.comment.entity.Comment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private Long taskId;
    private String writerLoginId;
    private String writerNickname;
    private LocalDateTime createdAt;

    public static CommentResponse from(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .taskId(comment.getTask().getId())
                .writerLoginId(comment.getWriter().getLoginId())
                .writerNickname(comment.getWriter().getNickname())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
