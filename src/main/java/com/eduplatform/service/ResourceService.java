package com.eduplatform.service;

import com.eduplatform.service.dto.ResourceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing Resource.
 */
public interface ResourceService {

    /**
     * Save a resource.
     *
     * @param resourceDTO the entity to save
     * @return the persisted entity
     */
    ResourceDTO save(ResourceDTO resourceDTO);

    /**
     * Get all the resources.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<ResourceDTO> findAll(Pageable pageable);

    /**
     * Get the "id" resource.
     *
     * @param id the id of the entity
     * @return the entity
     */
    ResourceDTO findOne(Long id);

    /**
     * Delete the "id" resource.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the resource corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<ResourceDTO> search(String query, Pageable pageable);
}
