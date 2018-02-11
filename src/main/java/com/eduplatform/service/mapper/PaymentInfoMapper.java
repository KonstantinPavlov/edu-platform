package com.eduplatform.service.mapper;

import com.eduplatform.domain.*;
import com.eduplatform.service.dto.PaymentInfoDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity PaymentInfo and its DTO PaymentInfoDTO.
 */
@Mapper(componentModel = "spring", uses = {CourseMapper.class, StudentMapper.class})
public interface PaymentInfoMapper extends EntityMapper<PaymentInfoDTO, PaymentInfo> {

    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "student.id", target = "studentId")
    PaymentInfoDTO toDto(PaymentInfo paymentInfo);

    @Mapping(source = "courseId", target = "course")
    @Mapping(source = "studentId", target = "student")
    PaymentInfo toEntity(PaymentInfoDTO paymentInfoDTO);

    default PaymentInfo fromId(Long id) {
        if (id == null) {
            return null;
        }
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setId(id);
        return paymentInfo;
    }
}
