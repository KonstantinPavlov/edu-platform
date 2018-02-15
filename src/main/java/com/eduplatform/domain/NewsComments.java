package com.eduplatform.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A NewsComments.
 */
@Entity
@Table(name = "news_comments")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "newscomments")
public class NewsComments implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @NotNull
    @Column(name = "jhi_comment", nullable = false)
    private String comment;

    @Column(name = "comment_date")
    private ZonedDateTime commentDate;

    @ManyToOne
    private News news;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public NewsComments userId(Long userId) {
        this.userId = userId;
        return this;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public NewsComments comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getCommentDate() {
        return commentDate;
    }

    public NewsComments commentDate(ZonedDateTime commentDate) {
        this.commentDate = commentDate;
        return this;
    }

    public void setCommentDate(ZonedDateTime commentDate) {
        this.commentDate = commentDate;
    }

    public News getNews() {
        return news;
    }

    public NewsComments news(News news) {
        this.news = news;
        return this;
    }

    public void setNews(News news) {
        this.news = news;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        NewsComments newsComments = (NewsComments) o;
        if (newsComments.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), newsComments.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "NewsComments{" +
            "id=" + getId() +
            ", userId=" + getUserId() +
            ", comment='" + getComment() + "'" +
            ", commentDate='" + getCommentDate() + "'" +
            "}";
    }
}
