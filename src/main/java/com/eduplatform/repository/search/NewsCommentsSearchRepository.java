package com.eduplatform.repository.search;

import com.eduplatform.domain.NewsComments;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the NewsComments entity.
 */
public interface NewsCommentsSearchRepository extends ElasticsearchRepository<NewsComments, Long> {
}
