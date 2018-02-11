package com.eduplatform.repository.search;

import com.eduplatform.domain.Discipline;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Discipline entity.
 */
public interface DisciplineSearchRepository extends ElasticsearchRepository<Discipline, Long> {
}
