package com.eduplatform.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.eduplatform.service.PaymentInfoService;
import com.eduplatform.web.rest.errors.BadRequestAlertException;
import com.eduplatform.web.rest.util.HeaderUtil;
import com.eduplatform.service.dto.PaymentInfoDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing PaymentInfo.
 */
@RestController
@RequestMapping("/api")
public class PaymentInfoResource {

    private final Logger log = LoggerFactory.getLogger(PaymentInfoResource.class);

    private static final String ENTITY_NAME = "paymentInfo";

    private final PaymentInfoService paymentInfoService;

    public PaymentInfoResource(PaymentInfoService paymentInfoService) {
        this.paymentInfoService = paymentInfoService;
    }

    /**
     * POST  /payment-infos : Create a new paymentInfo.
     *
     * @param paymentInfoDTO the paymentInfoDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new paymentInfoDTO, or with status 400 (Bad Request) if the paymentInfo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/payment-infos")
    @Timed
    public ResponseEntity<PaymentInfoDTO> createPaymentInfo(@RequestBody PaymentInfoDTO paymentInfoDTO) throws URISyntaxException {
        log.debug("REST request to save PaymentInfo : {}", paymentInfoDTO);
        if (paymentInfoDTO.getId() != null) {
            throw new BadRequestAlertException("A new paymentInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentInfoDTO result = paymentInfoService.save(paymentInfoDTO);
        return ResponseEntity.created(new URI("/api/payment-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /payment-infos : Updates an existing paymentInfo.
     *
     * @param paymentInfoDTO the paymentInfoDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated paymentInfoDTO,
     * or with status 400 (Bad Request) if the paymentInfoDTO is not valid,
     * or with status 500 (Internal Server Error) if the paymentInfoDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/payment-infos")
    @Timed
    public ResponseEntity<PaymentInfoDTO> updatePaymentInfo(@RequestBody PaymentInfoDTO paymentInfoDTO) throws URISyntaxException {
        log.debug("REST request to update PaymentInfo : {}", paymentInfoDTO);
        if (paymentInfoDTO.getId() == null) {
            return createPaymentInfo(paymentInfoDTO);
        }
        PaymentInfoDTO result = paymentInfoService.save(paymentInfoDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, paymentInfoDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /payment-infos : get all the paymentInfos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of paymentInfos in body
     */
    @GetMapping("/payment-infos")
    @Timed
    public List<PaymentInfoDTO> getAllPaymentInfos() {
        log.debug("REST request to get all PaymentInfos");
        return paymentInfoService.findAll();
        }

    /**
     * GET  /payment-infos/:id : get the "id" paymentInfo.
     *
     * @param id the id of the paymentInfoDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paymentInfoDTO, or with status 404 (Not Found)
     */
    @GetMapping("/payment-infos/{id}")
    @Timed
    public ResponseEntity<PaymentInfoDTO> getPaymentInfo(@PathVariable Long id) {
        log.debug("REST request to get PaymentInfo : {}", id);
        PaymentInfoDTO paymentInfoDTO = paymentInfoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(paymentInfoDTO));
    }

    /**
     * DELETE  /payment-infos/:id : delete the "id" paymentInfo.
     *
     * @param id the id of the paymentInfoDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/payment-infos/{id}")
    @Timed
    public ResponseEntity<Void> deletePaymentInfo(@PathVariable Long id) {
        log.debug("REST request to delete PaymentInfo : {}", id);
        paymentInfoService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/payment-infos?query=:query : search for the paymentInfo corresponding
     * to the query.
     *
     * @param query the query of the paymentInfo search
     * @return the result of the search
     */
    @GetMapping("/_search/payment-infos")
    @Timed
    public List<PaymentInfoDTO> searchPaymentInfos(@RequestParam String query) {
        log.debug("REST request to search PaymentInfos for query {}", query);
        return paymentInfoService.search(query);
    }

}
