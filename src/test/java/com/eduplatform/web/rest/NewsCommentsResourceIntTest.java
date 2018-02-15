package com.eduplatform.web.rest;

import com.eduplatform.EduPlatformApp;

import com.eduplatform.domain.NewsComments;
import com.eduplatform.repository.NewsCommentsRepository;
import com.eduplatform.service.NewsCommentsService;
import com.eduplatform.repository.search.NewsCommentsSearchRepository;
import com.eduplatform.service.dto.NewsCommentsDTO;
import com.eduplatform.service.mapper.NewsCommentsMapper;
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
 * Test class for the NewsCommentsResource REST controller.
 *
 * @see NewsCommentsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = EduPlatformApp.class)
public class NewsCommentsResourceIntTest {

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long UPDATED_USER_ID = 2L;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_COMMENT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_COMMENT_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private NewsCommentsRepository newsCommentsRepository;

    @Autowired
    private NewsCommentsMapper newsCommentsMapper;

    @Autowired
    private NewsCommentsService newsCommentsService;

    @Autowired
    private NewsCommentsSearchRepository newsCommentsSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restNewsCommentsMockMvc;

    private NewsComments newsComments;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NewsCommentsResource newsCommentsResource = new NewsCommentsResource(newsCommentsService);
        this.restNewsCommentsMockMvc = MockMvcBuilders.standaloneSetup(newsCommentsResource)
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
    public static NewsComments createEntity(EntityManager em) {
        NewsComments newsComments = new NewsComments()
            .userId(DEFAULT_USER_ID)
            .comment(DEFAULT_COMMENT)
            .commentDate(DEFAULT_COMMENT_DATE);
        return newsComments;
    }

    @Before
    public void initTest() {
        newsCommentsSearchRepository.deleteAll();
        newsComments = createEntity(em);
    }

    @Test
    @Transactional
    public void createNewsComments() throws Exception {
        int databaseSizeBeforeCreate = newsCommentsRepository.findAll().size();

        // Create the NewsComments
        NewsCommentsDTO newsCommentsDTO = newsCommentsMapper.toDto(newsComments);
        restNewsCommentsMockMvc.perform(post("/api/news-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsCommentsDTO)))
            .andExpect(status().isCreated());

        // Validate the NewsComments in the database
        List<NewsComments> newsCommentsList = newsCommentsRepository.findAll();
        assertThat(newsCommentsList).hasSize(databaseSizeBeforeCreate + 1);
        NewsComments testNewsComments = newsCommentsList.get(newsCommentsList.size() - 1);
        assertThat(testNewsComments.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testNewsComments.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testNewsComments.getCommentDate()).isEqualTo(DEFAULT_COMMENT_DATE);

        // Validate the NewsComments in Elasticsearch
        NewsComments newsCommentsEs = newsCommentsSearchRepository.findOne(testNewsComments.getId());
        assertThat(testNewsComments.getCommentDate()).isEqualTo(testNewsComments.getCommentDate());
        assertThat(newsCommentsEs).isEqualToIgnoringGivenFields(testNewsComments, "commentDate");
    }

    @Test
    @Transactional
    public void createNewsCommentsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = newsCommentsRepository.findAll().size();

        // Create the NewsComments with an existing ID
        newsComments.setId(1L);
        NewsCommentsDTO newsCommentsDTO = newsCommentsMapper.toDto(newsComments);

        // An entity with an existing ID cannot be created, so this API call must fail
        restNewsCommentsMockMvc.perform(post("/api/news-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsCommentsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the NewsComments in the database
        List<NewsComments> newsCommentsList = newsCommentsRepository.findAll();
        assertThat(newsCommentsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkCommentIsRequired() throws Exception {
        int databaseSizeBeforeTest = newsCommentsRepository.findAll().size();
        // set the field null
        newsComments.setComment(null);

        // Create the NewsComments, which fails.
        NewsCommentsDTO newsCommentsDTO = newsCommentsMapper.toDto(newsComments);

        restNewsCommentsMockMvc.perform(post("/api/news-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsCommentsDTO)))
            .andExpect(status().isBadRequest());

        List<NewsComments> newsCommentsList = newsCommentsRepository.findAll();
        assertThat(newsCommentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllNewsComments() throws Exception {
        // Initialize the database
        newsCommentsRepository.saveAndFlush(newsComments);

        // Get all the newsCommentsList
        restNewsCommentsMockMvc.perform(get("/api/news-comments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(newsComments.getId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())))
            .andExpect(jsonPath("$.[*].commentDate").value(hasItem(sameInstant(DEFAULT_COMMENT_DATE))));
    }

    @Test
    @Transactional
    public void getNewsComments() throws Exception {
        // Initialize the database
        newsCommentsRepository.saveAndFlush(newsComments);

        // Get the newsComments
        restNewsCommentsMockMvc.perform(get("/api/news-comments/{id}", newsComments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(newsComments.getId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID.intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()))
            .andExpect(jsonPath("$.commentDate").value(sameInstant(DEFAULT_COMMENT_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingNewsComments() throws Exception {
        // Get the newsComments
        restNewsCommentsMockMvc.perform(get("/api/news-comments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateNewsComments() throws Exception {
        // Initialize the database
        newsCommentsRepository.saveAndFlush(newsComments);
        newsCommentsSearchRepository.save(newsComments);
        int databaseSizeBeforeUpdate = newsCommentsRepository.findAll().size();

        // Update the newsComments
        NewsComments updatedNewsComments = newsCommentsRepository.findOne(newsComments.getId());
        // Disconnect from session so that the updates on updatedNewsComments are not directly saved in db
        em.detach(updatedNewsComments);
        updatedNewsComments
            .userId(UPDATED_USER_ID)
            .comment(UPDATED_COMMENT)
            .commentDate(UPDATED_COMMENT_DATE);
        NewsCommentsDTO newsCommentsDTO = newsCommentsMapper.toDto(updatedNewsComments);

        restNewsCommentsMockMvc.perform(put("/api/news-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsCommentsDTO)))
            .andExpect(status().isOk());

        // Validate the NewsComments in the database
        List<NewsComments> newsCommentsList = newsCommentsRepository.findAll();
        assertThat(newsCommentsList).hasSize(databaseSizeBeforeUpdate);
        NewsComments testNewsComments = newsCommentsList.get(newsCommentsList.size() - 1);
        assertThat(testNewsComments.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testNewsComments.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testNewsComments.getCommentDate()).isEqualTo(UPDATED_COMMENT_DATE);

        // Validate the NewsComments in Elasticsearch
        NewsComments newsCommentsEs = newsCommentsSearchRepository.findOne(testNewsComments.getId());
        assertThat(testNewsComments.getCommentDate()).isEqualTo(testNewsComments.getCommentDate());
        assertThat(newsCommentsEs).isEqualToIgnoringGivenFields(testNewsComments, "commentDate");
    }

    @Test
    @Transactional
    public void updateNonExistingNewsComments() throws Exception {
        int databaseSizeBeforeUpdate = newsCommentsRepository.findAll().size();

        // Create the NewsComments
        NewsCommentsDTO newsCommentsDTO = newsCommentsMapper.toDto(newsComments);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restNewsCommentsMockMvc.perform(put("/api/news-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsCommentsDTO)))
            .andExpect(status().isCreated());

        // Validate the NewsComments in the database
        List<NewsComments> newsCommentsList = newsCommentsRepository.findAll();
        assertThat(newsCommentsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteNewsComments() throws Exception {
        // Initialize the database
        newsCommentsRepository.saveAndFlush(newsComments);
        newsCommentsSearchRepository.save(newsComments);
        int databaseSizeBeforeDelete = newsCommentsRepository.findAll().size();

        // Get the newsComments
        restNewsCommentsMockMvc.perform(delete("/api/news-comments/{id}", newsComments.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean newsCommentsExistsInEs = newsCommentsSearchRepository.exists(newsComments.getId());
        assertThat(newsCommentsExistsInEs).isFalse();

        // Validate the database is empty
        List<NewsComments> newsCommentsList = newsCommentsRepository.findAll();
        assertThat(newsCommentsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchNewsComments() throws Exception {
        // Initialize the database
        newsCommentsRepository.saveAndFlush(newsComments);
        newsCommentsSearchRepository.save(newsComments);

        // Search the newsComments
        restNewsCommentsMockMvc.perform(get("/api/_search/news-comments?query=id:" + newsComments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(newsComments.getId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())))
            .andExpect(jsonPath("$.[*].commentDate").value(hasItem(sameInstant(DEFAULT_COMMENT_DATE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NewsComments.class);
        NewsComments newsComments1 = new NewsComments();
        newsComments1.setId(1L);
        NewsComments newsComments2 = new NewsComments();
        newsComments2.setId(newsComments1.getId());
        assertThat(newsComments1).isEqualTo(newsComments2);
        newsComments2.setId(2L);
        assertThat(newsComments1).isNotEqualTo(newsComments2);
        newsComments1.setId(null);
        assertThat(newsComments1).isNotEqualTo(newsComments2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(NewsCommentsDTO.class);
        NewsCommentsDTO newsCommentsDTO1 = new NewsCommentsDTO();
        newsCommentsDTO1.setId(1L);
        NewsCommentsDTO newsCommentsDTO2 = new NewsCommentsDTO();
        assertThat(newsCommentsDTO1).isNotEqualTo(newsCommentsDTO2);
        newsCommentsDTO2.setId(newsCommentsDTO1.getId());
        assertThat(newsCommentsDTO1).isEqualTo(newsCommentsDTO2);
        newsCommentsDTO2.setId(2L);
        assertThat(newsCommentsDTO1).isNotEqualTo(newsCommentsDTO2);
        newsCommentsDTO1.setId(null);
        assertThat(newsCommentsDTO1).isNotEqualTo(newsCommentsDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(newsCommentsMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(newsCommentsMapper.fromId(null)).isNull();
    }
}
