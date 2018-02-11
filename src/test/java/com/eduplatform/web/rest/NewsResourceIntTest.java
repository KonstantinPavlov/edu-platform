package com.eduplatform.web.rest;

import com.eduplatform.EduPlatformApp;

import com.eduplatform.domain.News;
import com.eduplatform.repository.NewsRepository;
import com.eduplatform.service.NewsService;
import com.eduplatform.repository.search.NewsSearchRepository;
import com.eduplatform.service.dto.NewsDTO;
import com.eduplatform.service.mapper.NewsMapper;
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
 * Test class for the NewsResource REST controller.
 *
 * @see NewsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = EduPlatformApp.class)
public class NewsResourceIntTest {

    private static final String DEFAULT_NEWS_HEADER = "AAAAAAAAAA";
    private static final String UPDATED_NEWS_HEADER = "BBBBBBBBBB";

    private static final String DEFAULT_NEWS_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_NEWS_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NEWS_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NEWS_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private NewsMapper newsMapper;

    @Autowired
    private NewsService newsService;

    @Autowired
    private NewsSearchRepository newsSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restNewsMockMvc;

    private News news;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NewsResource newsResource = new NewsResource(newsService);
        this.restNewsMockMvc = MockMvcBuilders.standaloneSetup(newsResource)
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
    public static News createEntity(EntityManager em) {
        News news = new News()
            .newsHeader(DEFAULT_NEWS_HEADER)
            .newsDescription(DEFAULT_NEWS_DESCRIPTION)
            .newsDate(DEFAULT_NEWS_DATE);
        return news;
    }

    @Before
    public void initTest() {
        newsSearchRepository.deleteAll();
        news = createEntity(em);
    }

    @Test
    @Transactional
    public void createNews() throws Exception {
        int databaseSizeBeforeCreate = newsRepository.findAll().size();

        // Create the News
        NewsDTO newsDTO = newsMapper.toDto(news);
        restNewsMockMvc.perform(post("/api/news")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsDTO)))
            .andExpect(status().isCreated());

        // Validate the News in the database
        List<News> newsList = newsRepository.findAll();
        assertThat(newsList).hasSize(databaseSizeBeforeCreate + 1);
        News testNews = newsList.get(newsList.size() - 1);
        assertThat(testNews.getNewsHeader()).isEqualTo(DEFAULT_NEWS_HEADER);
        assertThat(testNews.getNewsDescription()).isEqualTo(DEFAULT_NEWS_DESCRIPTION);
        assertThat(testNews.getNewsDate()).isEqualTo(DEFAULT_NEWS_DATE);

        // Validate the News in Elasticsearch
        News newsEs = newsSearchRepository.findOne(testNews.getId());
        assertThat(testNews.getNewsDate()).isEqualTo(testNews.getNewsDate());
        assertThat(newsEs).isEqualToIgnoringGivenFields(testNews, "newsDate");
    }

    @Test
    @Transactional
    public void createNewsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = newsRepository.findAll().size();

        // Create the News with an existing ID
        news.setId(1L);
        NewsDTO newsDTO = newsMapper.toDto(news);

        // An entity with an existing ID cannot be created, so this API call must fail
        restNewsMockMvc.perform(post("/api/news")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the News in the database
        List<News> newsList = newsRepository.findAll();
        assertThat(newsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNewsHeaderIsRequired() throws Exception {
        int databaseSizeBeforeTest = newsRepository.findAll().size();
        // set the field null
        news.setNewsHeader(null);

        // Create the News, which fails.
        NewsDTO newsDTO = newsMapper.toDto(news);

        restNewsMockMvc.perform(post("/api/news")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsDTO)))
            .andExpect(status().isBadRequest());

        List<News> newsList = newsRepository.findAll();
        assertThat(newsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllNews() throws Exception {
        // Initialize the database
        newsRepository.saveAndFlush(news);

        // Get all the newsList
        restNewsMockMvc.perform(get("/api/news?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(news.getId().intValue())))
            .andExpect(jsonPath("$.[*].newsHeader").value(hasItem(DEFAULT_NEWS_HEADER.toString())))
            .andExpect(jsonPath("$.[*].newsDescription").value(hasItem(DEFAULT_NEWS_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].newsDate").value(hasItem(sameInstant(DEFAULT_NEWS_DATE))));
    }

    @Test
    @Transactional
    public void getNews() throws Exception {
        // Initialize the database
        newsRepository.saveAndFlush(news);

        // Get the news
        restNewsMockMvc.perform(get("/api/news/{id}", news.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(news.getId().intValue()))
            .andExpect(jsonPath("$.newsHeader").value(DEFAULT_NEWS_HEADER.toString()))
            .andExpect(jsonPath("$.newsDescription").value(DEFAULT_NEWS_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.newsDate").value(sameInstant(DEFAULT_NEWS_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingNews() throws Exception {
        // Get the news
        restNewsMockMvc.perform(get("/api/news/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateNews() throws Exception {
        // Initialize the database
        newsRepository.saveAndFlush(news);
        newsSearchRepository.save(news);
        int databaseSizeBeforeUpdate = newsRepository.findAll().size();

        // Update the news
        News updatedNews = newsRepository.findOne(news.getId());
        // Disconnect from session so that the updates on updatedNews are not directly saved in db
        em.detach(updatedNews);
        updatedNews
            .newsHeader(UPDATED_NEWS_HEADER)
            .newsDescription(UPDATED_NEWS_DESCRIPTION)
            .newsDate(UPDATED_NEWS_DATE);
        NewsDTO newsDTO = newsMapper.toDto(updatedNews);

        restNewsMockMvc.perform(put("/api/news")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsDTO)))
            .andExpect(status().isOk());

        // Validate the News in the database
        List<News> newsList = newsRepository.findAll();
        assertThat(newsList).hasSize(databaseSizeBeforeUpdate);
        News testNews = newsList.get(newsList.size() - 1);
        assertThat(testNews.getNewsHeader()).isEqualTo(UPDATED_NEWS_HEADER);
        assertThat(testNews.getNewsDescription()).isEqualTo(UPDATED_NEWS_DESCRIPTION);
        assertThat(testNews.getNewsDate()).isEqualTo(UPDATED_NEWS_DATE);

        // Validate the News in Elasticsearch
        News newsEs = newsSearchRepository.findOne(testNews.getId());
        assertThat(testNews.getNewsDate()).isEqualTo(testNews.getNewsDate());
        assertThat(newsEs).isEqualToIgnoringGivenFields(testNews, "newsDate");
    }

    @Test
    @Transactional
    public void updateNonExistingNews() throws Exception {
        int databaseSizeBeforeUpdate = newsRepository.findAll().size();

        // Create the News
        NewsDTO newsDTO = newsMapper.toDto(news);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restNewsMockMvc.perform(put("/api/news")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsDTO)))
            .andExpect(status().isCreated());

        // Validate the News in the database
        List<News> newsList = newsRepository.findAll();
        assertThat(newsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteNews() throws Exception {
        // Initialize the database
        newsRepository.saveAndFlush(news);
        newsSearchRepository.save(news);
        int databaseSizeBeforeDelete = newsRepository.findAll().size();

        // Get the news
        restNewsMockMvc.perform(delete("/api/news/{id}", news.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean newsExistsInEs = newsSearchRepository.exists(news.getId());
        assertThat(newsExistsInEs).isFalse();

        // Validate the database is empty
        List<News> newsList = newsRepository.findAll();
        assertThat(newsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchNews() throws Exception {
        // Initialize the database
        newsRepository.saveAndFlush(news);
        newsSearchRepository.save(news);

        // Search the news
        restNewsMockMvc.perform(get("/api/_search/news?query=id:" + news.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(news.getId().intValue())))
            .andExpect(jsonPath("$.[*].newsHeader").value(hasItem(DEFAULT_NEWS_HEADER.toString())))
            .andExpect(jsonPath("$.[*].newsDescription").value(hasItem(DEFAULT_NEWS_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].newsDate").value(hasItem(sameInstant(DEFAULT_NEWS_DATE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(News.class);
        News news1 = new News();
        news1.setId(1L);
        News news2 = new News();
        news2.setId(news1.getId());
        assertThat(news1).isEqualTo(news2);
        news2.setId(2L);
        assertThat(news1).isNotEqualTo(news2);
        news1.setId(null);
        assertThat(news1).isNotEqualTo(news2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(NewsDTO.class);
        NewsDTO newsDTO1 = new NewsDTO();
        newsDTO1.setId(1L);
        NewsDTO newsDTO2 = new NewsDTO();
        assertThat(newsDTO1).isNotEqualTo(newsDTO2);
        newsDTO2.setId(newsDTO1.getId());
        assertThat(newsDTO1).isEqualTo(newsDTO2);
        newsDTO2.setId(2L);
        assertThat(newsDTO1).isNotEqualTo(newsDTO2);
        newsDTO1.setId(null);
        assertThat(newsDTO1).isNotEqualTo(newsDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(newsMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(newsMapper.fromId(null)).isNull();
    }
}
