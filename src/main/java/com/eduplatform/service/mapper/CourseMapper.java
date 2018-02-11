package com.eduplatform.service.mapper;

import com.eduplatform.domain.*;
import com.eduplatform.service.dto.CourseDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Course and its DTO CourseDTO.
 */
@Mapper(componentModel = "spring", uses = {StudentMapper.class, LessonMapper.class})
public interface CourseMapper extends EntityMapper<CourseDTO, Course> {

    @Mapping(source = "student.id", target = "studentId")
    CourseDTO toDto(Course course);

    @Mapping(source = "studentId", target = "student")
    @Mapping(target = "resources", ignore = true)
    @Mapping(target = "payments", ignore = true)
    @Mapping(target = "programs", ignore = true)
    Course toEntity(CourseDTO courseDTO);

    default Course fromId(Long id) {
        if (id == null) {
            return null;
        }
        Course course = new Course();
        course.setId(id);
        return course;
    }
}
