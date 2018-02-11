package com.eduplatform.web.rest;

import com.eduplatform.EduPlatformApp;

import com.eduplatform.domain.PaymentInfo;
import com.eduplatform.repository.PaymentInfoRepository;
import com.eduplatform.service.PaymentInfoService;
import com.eduplatform.repository.search.PaymentInfoSearchRepository;
import com.eduplatform.service.dto.PaymentInfoDTO;
import com.eduplatform.service.mapper.PaymentInfoMapper;
import com.eduplatform.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.eduplatform.web.rest.TestUtil.sameInstant;
import static com.eduplatform.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PaymentInfoResource REST controller.
 *
 * @see PaymentInfoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = EduPlatformApp.class)
public class PaymentInfoResourceIntTest {

    private static final ZonedDateTime DEFAULT_PAYMENT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_PAYMENT_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_PAYMENT_AMOUNT = 1L;
    private static final Long UPDATED_PAYMENT_AMOUNT = 2L;

    @Autowired
    private PaymentInfoRepository paymentInfoRepository;

    @Autowired
    private PaymentInfoMapper paymentInfoMapper;

    @Autowired
    private PaymentInfoService paymentInfoService;

    @Autowired
    private PaymentInfoSearchRepository paymentInfoSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPaymentInfoMockMvc;

    private PaymentInfo paymentInfo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PaymentInfoResource paymentInfoResource = new PaymentInfoResource(paymentInfoService);
        this.restPaymentInfoMockMvc = MockMvcBuilders.standaloneSetup(paymentInfoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentInfo createEntity(EntityManager em) {
        PaymentInfo paymentInfo = new PaymentInfo()
            .paymentDate(DEFAULT_PAYMENT_DATE)
            .paymentAmount(DEFAULT_PAYMENT_AMOUNT);
        return paymentInfo;
    }

    @Before
    public void initTest() {
        paymentInfoSearchRepository.deleteAll();
        paymentInfo = createEntity(em);
    }

    @Test
    @Transactional
    public void createPaymentInfo() throws Exception {
        int databaseSizeBeforeCreate = paymentInfoRepository.findAll().size();

        // Create the PaymentInfo
        PaymentInfoDTO paymentInfoDTO = paymentInfoMapper.toDto(paymentInfo);
        restPaymentInfoMockMvc.perform(post("/api/payment-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentInfoDTO)))
            .andExpect(status().isCreated());

        // Validate the PaymentInfo in the database
        List<PaymentInfo> paymentInfoList = paymentInfoRepository.findAll();
        assertThat(paymentInfoList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentInfo testPaymentInfo = paymentInfoList.get(paymentInfoList.size() - 1);
        assertThat(testPaymentInfo.getPaymentDate()).isEqualTo(DEFAULT_PAYMENT_DATE);
        assertThat(testPaymentInfo.getPaymentAmount()).isEqualTo(DEFAULT_PAYMENT_AMOUNT);

        // Validate the PaymentInfo in Elasticsearch
        PaymentInfo paymentInfoEs = paymentInfoSearchRepository.findOne(testPaymentInfo.getId());
        assertThat(testPaymentInfo.getPaymentDate()).isEqualTo(testPaymentInfo.getPaymentDate());
        assertThat(paymentInfoEs).isEqualToIgnoringGivenFields(testPaymentInfo, "paymentDate");
    }

    @Test
    @Transactional
    public void createPaymentInfoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paymentInfoRepository.findAll().size();

        // Create the PaymentInfo with an existing ID
        paymentInfo.setId(1L);
        PaymentInfoDTO paymentInfoDTO = paymentInfoMapper.toDto(paymentInfo);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentInfoMockMvc.perform(post("/api/payment-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentInfoDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentInfo in the database
        List<PaymentInfo> paymentInfoList = paymentInfoRepository.findAll();
        assertThat(paymentInfoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPaymentInfos() throws Exception {
        // Initialize the database
        paymentInfoRepository.saveAndFlush(paymentInfo);

        // Get all the paymentInfoList
        restPaymentInfoMockMvc.perform(get("/api/payment-infos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].paymentDate").value(hasItem(sameInstant(DEFAULT_PAYMENT_DATE))))
            .andExpect(jsonPath("$.[*].paymentAmount").value(hasItem(DEFAULT_PAYMENT_AMOUNT.intValue())));
    }

    @Test
    @Transactional
    public void getPaymentInfo() throws Exception {
        // Initialize the database
        paymentInfoRepository.saveAndFlush(paymentInfo);

        // Get the paymentInfo
        restPaymentInfoMockMvc.perform(get("/api/payment-infos/{id}", paymentInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(paymentInfo.getId().intValue()))
            .andExpect(jsonPath("$.paymentDate").value(sameInstant(DEFAULT_PAYMENT_DATE)))
            .andExpect(jsonPath("$.paymentAmount").value(DEFAULT_PAYMENT_AMOUNT.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingPaymentInfo() throws Exception {
        // Get the paymentInfo
        restPaymentInfoMockMvc.perform(get("/api/payment-infos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePaymentInfo() throws Exception {
        // Initialize the database
        paymentInfoRepository.saveAndFlush(paymentInfo);
        paymentInfoSearchRepository.save(paymentInfo);
        int databaseSizeBeforeUpdate = paymentInfoRepository.findAll().size();

        // Update the paymentInfo
        PaymentInfo updatedPaymentInfo = paymentInfoRepository.findOne(paymentInfo.getId());
        // Disconnect from session so that the updates on updatedPaymentInfo are not directly saved in db
        em.detach(updatedPaymentInfo);
        updatedPaymentInfo
            .paymentDate(UPDATED_PAYMENT_DATE)
            .paymentAmount(UPDATED_PAYMENT_AMOUNT);
        PaymentInfoDTO paymentInfoDTO = paymentInfoMapper.toDto(updatedPaymentInfo);

        restPaymentInfoMockMvc.perform(put("/api/payment-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentInfoDTO)))
            .andExpect(status().isOk());

        // Validate the PaymentInfo in the database
        List<PaymentInfo> paymentInfoList = paymentInfoRepository.findAll();
        assertThat(paymentInfoList).hasSize(databaseSizeBeforeUpdate);
        PaymentInfo testPaymentInfo = paymentInfoList.get(paymentInfoList.size() - 1);
        assertThat(testPaymentInfo.getPaymentDate()).isEqualTo(UPDATED_PAYMENT_DATE);
        assertThat(testPaymentInfo.getPaymentAmount()).isEqualTo(UPDATED_PAYMENT_AMOUNT);

        // Validate the PaymentInfo in Elasticsearch
        PaymentInfo paymentInfoEs = paymentInfoSearchRepository.findOne(testPaymentInfo.getId());
        assertThat(testPaymentInfo.getPaymentDate()).isEqualTo(testPaymentInfo.getPaymentDate());
        assertThat(paymentInfoEs).isEqualToIgnoringGivenFields(testPaymentInfo, "paymentDate");
    }

    @Test
    @Transactional
    public void updateNonExistingPaymentInfo() throws Exception {
        int databaseSizeBeforeUpdate = paymentInfoRepository.findAll().size();

        // Create the PaymentInfo
        PaymentInfoDTO paymentInfoDTO = paymentInfoMapper.toDto(paymentInfo);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPaymentInfoMockMvc.perform(put("/api/payment-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentInfoDTO)))
            .andExpect(status().isCreated());

        // Validate the PaymentInfo in the database
        List<PaymentInfo> paymentInfoList = paymentInfoRepository.findAll();
        assertThat(paymentInfoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePaymentInfo() throws Exception {
        // Initialize the database
        paymentInfoRepository.saveAndFlush(paymentInfo);
        paymentInfoSearchRepository.save(paymentInfo);
        int databaseSizeBeforeDelete = paymentInfoRepository.findAll().size();

        // Get the paymentInfo
        restPaymentInfoMockMvc.perform(delete("/api/payment-infos/{id}", paymentInfo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean paymentInfoExistsInEs = paymentInfoSearchRepository.exists(paymentInfo.getId());
        assertThat(paymentInfoExistsInEs).isFalse();

        // Validate the database is empty
        List<PaymentInfo> paymentInfoList = paymentInfoRepository.findAll();
        assertThat(paymentInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPaymentInfo() throws Exception {
        // Initialize the database
        paymentInfoRepository.saveAndFlush(paymentInfo);
        paymentInfoSearchRepository.save(paymentInfo);

        // Search the paymentInfo
        restPaymentInfoMockMvc.perform(get("/api/_search/payment-infos?query=id:" + paymentInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].paymentDate").value(hasItem(sameInstant(DEFAULT_PAYMENT_DATE))))
            .andExpect(jsonPath("$.[*].paymentAmount").value(hasItem(DEFAULT_PAYMENT_AMOUNT.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentInfo.class);
        PaymentInfo paymentInfo1 = new PaymentInfo();
        paymentInfo1.setId(1L);
        PaymentInfo paymentInfo2 = new PaymentInfo();
        paymentInfo2.setId(paymentInfo1.getId());
        assertThat(paymentInfo1).isEqualTo(paymentInfo2);
        paymentInfo2.setId(2L);
        assertThat(paymentInfo1).isNotEqualTo(paymentInfo2);
        paymentInfo1.setId(null);
        assertThat(paymentInfo1).isNotEqualTo(paymentInfo2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentInfoDTO.class);
        PaymentInfoDTO paymentInfoDTO1 = new PaymentInfoDTO();
        paymentInfoDTO1.setId(1L);
        PaymentInfoDTO paymentInfoDTO2 = new PaymentInfoDTO();
        assertThat(paymentInfoDTO1).isNotEqualTo(paymentInfoDTO2);
        paymentInfoDTO2.setId(paymentInfoDTO1.getId());
        assertThat(paymentInfoDTO1).isEqualTo(paymentInfoDTO2);
        paymentInfoDTO2.setId(2L);
        assertThat(paymentInfoDTO1).isNotEqualTo(paymentInfoDTO2);
        paymentInfoDTO1.setId(null);
        assertThat(paymentInfoDTO1).isNotEqualTo(paymentInfoDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(paymentInfoMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(paymentInfoMapper.fromId(null)).isNull();
    }
}
