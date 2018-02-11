package com.eduplatform.repository;

import com.eduplatform.domain.PaymentInfo;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the PaymentInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {

}
