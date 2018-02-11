package com.eduplatform.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A News.
 */
@Entity
@Table(name = "news")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "news")
public class News implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "news_header", nullable = false)
    private String newsHeader;

    @Column(name = "news_description")
    private String newsDescription;

    @Column(name = "news_date")
    private ZonedDateTime newsDate;

    @OneToMany(mappedBy = "news")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Resource> resources = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNewsHeader() {
        return newsHeader;
    }

    public News newsHeader(String newsHeader) {
        this.newsHeader = newsHeader;
        return this;
    }

    public void setNewsHeader(String newsHeader) {
        this.newsHeader = newsHeader;
    }

    public String getNewsDescription() {
        return newsDescription;
    }

    public News newsDescription(String newsDescription) {
        this.newsDescription = newsDescription;
        return this;
    }

    public void setNewsDescription(String newsDescription) {
        this.newsDescription = newsDescription;
    }

    public ZonedDateTime getNewsDate() {
        return newsDate;
    }

    public News newsDate(ZonedDateTime newsDate) {
        this.newsDate = newsDate;
        return this;
    }

    public void setNewsDate(ZonedDateTime newsDate) {
        this.newsDate = newsDate;
    }

    public Set<Resource> getResources() {
        return resources;
    }

    public News resources(Set<Resource> resources) {
        this.resources = resources;
        return this;
    }

    public News addResources(Resource resource) {
        this.resources.add(resource);
        resource.setNews(this);
        return this;
    }

    public News removeResources(Resource resource) {
        this.resources.remove(resource);
        resource.setNews(null);
        return this;
    }

    public void setResources(Set<Resource> resources) {
        this.resources = resources;
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
        News news = (News) o;
        if (news.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), news.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "News{" +
            "id=" + getId() +
            ", newsHeader='" + getNewsHeader() + "'" +
            ", newsDescription='" + getNewsDescription() + "'" +
            ", newsDate='" + getNewsDate() + "'" +
            "}";
    }
}
