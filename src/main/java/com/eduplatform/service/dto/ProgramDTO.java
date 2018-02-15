package com.eduplatform.service.dto;


import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the Program entity.
 */
public class ProgramDTO implements Serializable {

    private Long id;

    @NotNull
    private String programName;

    private String programDescription;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public String getProgramDescription() {
        return programDescription;
    }

    public void setProgramDescription(String programDescription) {
        this.programDescription = programDescription;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ProgramDTO programDTO = (ProgramDTO) o;
        if(programDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), programDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProgramDTO{" +
            "id=" + getId() +
            ", programName='" + getProgramName() + "'" +
            ", programDescription='" + getProgramDescription() + "'" +
            "}";
    }
}
