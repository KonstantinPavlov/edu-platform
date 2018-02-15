package com.eduplatform.service.impl;

import com.eduplatform.service.PaymentInfoService;
import com.eduplatform.domain.PaymentInfo;
import com.eduplatform.repository.PaymentInfoRepository;
import com.eduplatform.repository.search.PaymentInfoSearchRepository;
import com.eduplatform.service.dto.PaymentInfoDTO;
import com.eduplatform.service.mapper.PaymentInfoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing PaymentInfo.
 */
@Service
@Transactional
public class PaymentInfoServiceImpl implements PaymentInfoService {

    private final Logger log = LoggerFactory.getLogger(PaymentInfoServiceImpl.class);

    private final PaymentInfoRepository paymentInfoRepository;

    private final PaymentInfoMapper paymentInfoMapper;

    private final PaymentInfoSearchRepository paymentInfoSearchRepository;

    public PaymentInfoServiceImpl(PaymentInfoRepository paymentInfoRepository, PaymentInfoMapper paymentInfoMapper, PaymentInfoSearchRepository paymentInfoSearchRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
        this.paymentInfoMapper = paymentInfoMapper;
        this.paymentInfoSearchRepository = paymentInfoSearchRepository;
    }

    /**
     * Save a paymentInfo.
     *
     * @param paymentInfoDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public PaymentInfoDTO save(PaymentInfoDTO paymentInfoDTO) {
        log.debug("Request to save PaymentInfo : {}", paymentInfoDTO);
        PaymentInfo paymentInfo = paymentInfoMapper.toEntity(paymentInfoDTO);
        paymentInfo = paymentInfoRepository.save(paymentInfo);
        PaymentInfoDTO result = paymentInfoMapper.toDto(paymentInfo);
        paymentInfoSearchRepository.save(paymentInfo);
        return result;
    }

    /**
     * Get all the paymentInfos.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<PaymentInfoDTO> findAll() {
        log.debug("Request to get all PaymentInfos");
        return paymentInfoRepository.findAll().stream()
            .map(paymentInfoMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one paymentInfo by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public PaymentInfoDTO findOne(Long id) {
        log.debug("Request to get PaymentInfo : {}", id);
        PaymentInfo paymentInfo = paymentInfoRepository.findOne(id);
        return paymentInfoMapper.toDto(paymentInfo);
    }

    /**
     * Delete the paymentInfo by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete PaymentInfo : {}", id);
        paymentInfoRepository.delete(id);
        paymentInfoSearchRepository.delete(id);
    }

    /**
     * Search for the paymentInfo corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<PaymentInfoDTO> search(String query) {
        log.debug("Request to search PaymentInfos for query {}", query);
        return StreamSupport
            .stream(paymentInfoSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .map(paymentInfoMapper::toDto)
            .collect(Collectors.toList());
    }
}
