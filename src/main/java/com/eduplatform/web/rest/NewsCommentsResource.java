package com.eduplatform.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.eduplatform.service.NewsCommentsService;
import com.eduplatform.web.rest.errors.BadRequestAlertException;
import com.eduplatform.web.rest.util.HeaderUtil;
import com.eduplatform.service.dto.NewsCommentsDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing NewsComments.
 */
@RestController
@RequestMapping("/api")
public class NewsCommentsResource {

    private final Logger log = LoggerFactory.getLogger(NewsCommentsResource.class);

    private static final String ENTITY_NAME = "newsComments";

    private final NewsCommentsService newsCommentsService;

    public NewsCommentsResource(NewsCommentsService newsCommentsService) {
        this.newsCommentsService = newsCommentsService;
    }

    /**
     * POST  /news-comments : Create a new newsComments.
     *
     * @param newsCommentsDTO the newsCommentsDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new newsCommentsDTO, or with status 400 (Bad Request) if the newsComments has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/news-comments")
    @Timed
    public ResponseEntity<NewsCommentsDTO> createNewsComments(@Valid @RequestBody NewsCommentsDTO newsCommentsDTO) throws URISyntaxException {
        log.debug("REST request to save NewsComments : {}", newsCommentsDTO);
        if (newsCommentsDTO.getId() != null) {
            throw new BadRequestAlertException("A new newsComments cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NewsCommentsDTO result = newsCommentsService.save(newsCommentsDTO);
        return ResponseEntity.created(new URI("/api/news-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /news-comments : Updates an existing newsComments.
     *
     * @param newsCommentsDTO the newsCommentsDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated newsCommentsDTO,
     * or with status 400 (Bad Request) if the newsCommentsDTO is not valid,
     * or with status 500 (Internal Server Error) if the newsCommentsDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/news-comments")
    @Timed
    public ResponseEntity<NewsCommentsDTO> updateNewsComments(@Valid @RequestBody NewsCommentsDTO newsCommentsDTO) throws URISyntaxException {
        log.debug("REST request to update NewsComments : {}", newsCommentsDTO);
        if (newsCommentsDTO.getId() == null) {
            return createNewsComments(newsCommentsDTO);
        }
        NewsCommentsDTO result = newsCommentsService.save(newsCommentsDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, newsCommentsDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /news-comments : get all the newsComments.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of newsComments in body
     */
    @GetMapping("/news-comments")
    @Timed
    public List<NewsCommentsDTO> getAllNewsComments() {
        log.debug("REST request to get all NewsComments");
        return newsCommentsService.findAll();
        }

    /**
     * GET  /news-comments/:id : get the "id" newsComments.
     *
     * @param id the id of the newsCommentsDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the newsCommentsDTO, or with status 404 (Not Found)
     */
    @GetMapping("/news-comments/{id}")
    @Timed
    public ResponseEntity<NewsCommentsDTO> getNewsComments(@PathVariable Long id) {
        log.debug("REST request to get NewsComments : {}", id);
        NewsCommentsDTO newsCommentsDTO = newsCommentsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(newsCommentsDTO));
    }

    /**
     * DELETE  /news-comments/:id : delete the "id" newsComments.
     *
     * @param id the id of the newsCommentsDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/news-comments/{id}")
    @Timed
    public ResponseEntity<Void> deleteNewsComments(@PathVariable Long id) {
        log.debug("REST request to delete NewsComments : {}", id);
        newsCommentsService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/news-comments?query=:query : search for the newsComments corresponding
     * to the query.
     *
     * @param query the query of the newsComments search
     * @return the result of the search
     */
    @GetMapping("/_search/news-comments")
    @Timed
    public List<NewsCommentsDTO> searchNewsComments(@RequestParam String query) {
        log.debug("REST request to search NewsComments for query {}", query);
        return newsCommentsService.search(query);
    }

}
