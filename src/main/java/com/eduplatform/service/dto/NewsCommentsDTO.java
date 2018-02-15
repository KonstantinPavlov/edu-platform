package com.eduplatform.service.dto;


import java.time.ZonedDateTime;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the NewsComments entity.
 */
public class NewsCommentsDTO implements Serializable {

    private Long id;

    private Long userId;

    @NotNull
    private String comment;

    private ZonedDateTime commentDate;

    private Long newsId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getCommentDate() {
        return commentDate;
    }

    public void setCommentDate(ZonedDateTime commentDate) {
        this.commentDate = commentDate;
    }

    public Long getNewsId() {
        return newsId;
    }

    public void setNewsId(Long newsId) {
        this.newsId = newsId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        NewsCommentsDTO newsCommentsDTO = (NewsCommentsDTO) o;
        if(newsCommentsDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), newsCommentsDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "NewsCommentsDTO{" +
            "id=" + getId() +
            ", userId=" + getUserId() +
            ", comment='" + getComment() + "'" +
            ", commentDate='" + getCommentDate() + "'" +
            "}";
    }
}
