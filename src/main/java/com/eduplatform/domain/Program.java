package com.eduplatform.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Program.
 */
@Entity
@Table(name = "program")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "program")
public class Program implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "program_name", nullable = false)
    private String programName;

    @Column(name = "program_description")
    private String programDescription;

    @OneToMany(mappedBy = "program")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Resource> resources = new HashSet<>();

    @OneToMany(mappedBy = "program")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Course> cources = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProgramName() {
        return programName;
    }

    public Program programName(String programName) {
        this.programName = programName;
        return this;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public String getProgramDescription() {
        return programDescription;
    }

    public Program programDescription(String programDescription) {
        this.programDescription = programDescription;
        return this;
    }

    public void setProgramDescription(String programDescription) {
        this.programDescription = programDescription;
    }

    public Set<Resource> getResources() {
        return resources;
    }

    public Program resources(Set<Resource> resources) {
        this.resources = resources;
        return this;
    }

    public Program addResources(Resource resource) {
        this.resources.add(resource);
        resource.setProgram(this);
        return this;
    }

    public Program removeResources(Resource resource) {
        this.resources.remove(resource);
        resource.setProgram(null);
        return this;
    }

    public void setResources(Set<Resource> resources) {
        this.resources = resources;
    }

    public Set<Course> getCources() {
        return cources;
    }

    public Program cources(Set<Course> courses) {
        this.cources = courses;
        return this;
    }

    public Program addCources(Course course) {
        this.cources.add(course);
        course.setProgram(this);
        return this;
    }

    public Program removeCources(Course course) {
        this.cources.remove(course);
        course.setProgram(null);
        return this;
    }

    public void setCources(Set<Course> courses) {
        this.cources = courses;
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
        Program program = (Program) o;
        if (program.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), program.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Program{" +
            "id=" + getId() +
            ", programName='" + getProgramName() + "'" +
            ", programDescription='" + getProgramDescription() + "'" +
            "}";
    }
}
