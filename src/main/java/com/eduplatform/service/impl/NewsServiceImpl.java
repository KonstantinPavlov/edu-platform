package com.eduplatform.service.impl;

import com.eduplatform.service.NewsService;
import com.eduplatform.domain.News;
import com.eduplatform.repository.NewsRepository;
import com.eduplatform.repository.search.NewsSearchRepository;
import com.eduplatform.service.dto.NewsDTO;
import com.eduplatform.service.mapper.NewsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing News.
 */
@Service
@Transactional
public class NewsServiceImpl implements NewsService {

    private final Logger log = LoggerFactory.getLogger(NewsServiceImpl.class);

    private final NewsRepository newsRepository;

    private final NewsMapper newsMapper;

    private final NewsSearchRepository newsSearchRepository;

    public NewsServiceImpl(NewsRepository newsRepository, NewsMapper newsMapper, NewsSearchRepository newsSearchRepository) {
        this.newsRepository = newsRepository;
        this.newsMapper = newsMapper;
        this.newsSearchRepository = newsSearchRepository;
    }

    /**
     * Save a news.
     *
     * @param newsDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public NewsDTO save(NewsDTO newsDTO) {
        log.debug("Request to save News : {}", newsDTO);
        News news = newsMapper.toEntity(newsDTO);
        news = newsRepository.save(news);
        NewsDTO result = newsMapper.toDto(news);
        newsSearchRepository.save(news);
        return result;
    }

    /**
     * Get all the news.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<NewsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all News");
        return newsRepository.findAll(pageable)
            .map(newsMapper::toDto);
    }

    /**
     * Get one news by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public NewsDTO findOne(Long id) {
        log.debug("Request to get News : {}", id);
        News news = newsRepository.findOne(id);
        return newsMapper.toDto(news);
    }

    /**
     * Delete the news by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete News : {}", id);
        newsRepository.delete(id);
        newsSearchRepository.delete(id);
    }

    /**
     * Search for the news corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<NewsDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of News for query {}", query);
        Page<News> result = newsSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(newsMapper::toDto);
    }
}
