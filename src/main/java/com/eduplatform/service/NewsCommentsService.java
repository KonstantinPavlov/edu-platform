package com.eduplatform.service;

import com.eduplatform.service.dto.NewsCommentsDTO;
import java.util.List;

/**
 * Service Interface for managing NewsComments.
 */
public interface NewsCommentsService {

    /**
     * Save a newsComments.
     *
     * @param newsCommentsDTO the entity to save
     * @return the persisted entity
     */
    NewsCommentsDTO save(NewsCommentsDTO newsCommentsDTO);

    /**
     * Get all the newsComments.
     *
     * @return the list of entities
     */
    List<NewsCommentsDTO> findAll();

    /**
     * Get the "id" newsComments.
     *
     * @param id the id of the entity
     * @return the entity
     */
    NewsCommentsDTO findOne(Long id);

    /**
     * Delete the "id" newsComments.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the newsComments corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<NewsCommentsDTO> search(String query);
}
