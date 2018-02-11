package com.eduplatform.service.dto;


import java.time.ZonedDateTime;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the News entity.
 */
public class NewsDTO implements Serializable {

    private Long id;

    @NotNull
    private String newsHeader;

    private String newsDescription;

    private ZonedDateTime newsDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNewsHeader() {
        return newsHeader;
    }

    public void setNewsHeader(String newsHeader) {
        this.newsHeader = newsHeader;
    }

    public String getNewsDescription() {
        return newsDescription;
    }

    public void setNewsDescription(String newsDescription) {
        this.newsDescription = newsDescription;
    }

    public ZonedDateTime getNewsDate() {
        return newsDate;
    }

    public void setNewsDate(ZonedDateTime newsDate) {
        this.newsDate = newsDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        NewsDTO newsDTO = (NewsDTO) o;
        if(newsDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), newsDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "NewsDTO{" +
            "id=" + getId() +
            ", newsHeader='" + getNewsHeader() + "'" +
            ", newsDescription='" + getNewsDescription() + "'" +
            ", newsDate='" + getNewsDate() + "'" +
            "}";
    }
}
