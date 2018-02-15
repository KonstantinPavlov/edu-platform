package com.eduplatform.service.impl;

import com.eduplatform.service.NewsCommentsService;
import com.eduplatform.domain.NewsComments;
import com.eduplatform.repository.NewsCommentsRepository;
import com.eduplatform.repository.search.NewsCommentsSearchRepository;
import com.eduplatform.service.dto.NewsCommentsDTO;
import com.eduplatform.service.mapper.NewsCommentsMapper;
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
 * Service Implementation for managing NewsComments.
 */
@Service
@Transactional
public class NewsCommentsServiceImpl implements NewsCommentsService {

    private final Logger log = LoggerFactory.getLogger(NewsCommentsServiceImpl.class);

    private final NewsCommentsRepository newsCommentsRepository;

    private final NewsCommentsMapper newsCommentsMapper;

    private final NewsCommentsSearchRepository newsCommentsSearchRepository;

    public NewsCommentsServiceImpl(NewsCommentsRepository newsCommentsRepository, NewsCommentsMapper newsCommentsMapper, NewsCommentsSearchRepository newsCommentsSearchRepository) {
        this.newsCommentsRepository = newsCommentsRepository;
        this.newsCommentsMapper = newsCommentsMapper;
        this.newsCommentsSearchRepository = newsCommentsSearchRepository;
    }

    /**
     * Save a newsComments.
     *
     * @param newsCommentsDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public NewsCommentsDTO save(NewsCommentsDTO newsCommentsDTO) {
        log.debug("Request to save NewsComments : {}", newsCommentsDTO);
        NewsComments newsComments = newsCommentsMapper.toEntity(newsCommentsDTO);
        newsComments = newsCommentsRepository.save(newsComments);
        NewsCommentsDTO result = newsCommentsMapper.toDto(newsComments);
        newsCommentsSearchRepository.save(newsComments);
        return result;
    }

    /**
     * Get all the newsComments.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<NewsCommentsDTO> findAll() {
        log.debug("Request to get all NewsComments");
        return newsCommentsRepository.findAll().stream()
            .map(newsCommentsMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one newsComments by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public NewsCommentsDTO findOne(Long id) {
        log.debug("Request to get NewsComments : {}", id);
        NewsComments newsComments = newsCommentsRepository.findOne(id);
        return newsCommentsMapper.toDto(newsComments);
    }

    /**
     * Delete the newsComments by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete NewsComments : {}", id);
        newsCommentsRepository.delete(id);
        newsCommentsSearchRepository.delete(id);
    }

    /**
     * Search for the newsComments corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<NewsCommentsDTO> search(String query) {
        log.debug("Request to search NewsComments for query {}", query);
        return StreamSupport
            .stream(newsCommentsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .map(newsCommentsMapper::toDto)
            .collect(Collectors.toList());
    }
}
