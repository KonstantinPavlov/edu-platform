package com.eduplatform.service;

import com.eduplatform.service.dto.PaymentInfoDTO;
import java.util.List;

/**
 * Service Interface for managing PaymentInfo.
 */
public interface PaymentInfoService {

    /**
     * Save a paymentInfo.
     *
     * @param paymentInfoDTO the entity to save
     * @return the persisted entity
     */
    PaymentInfoDTO save(PaymentInfoDTO paymentInfoDTO);

    /**
     * Get all the paymentInfos.
     *
     * @return the list of entities
     */
    List<PaymentInfoDTO> findAll();

    /**
     * Get the "id" paymentInfo.
     *
     * @param id the id of the entity
     * @return the entity
     */
    PaymentInfoDTO findOne(Long id);

    /**
     * Delete the "id" paymentInfo.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the paymentInfo corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<PaymentInfoDTO> search(String query);
}
