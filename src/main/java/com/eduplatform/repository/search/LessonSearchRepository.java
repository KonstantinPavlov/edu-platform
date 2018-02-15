package com.eduplatform.repository.search;

import com.eduplatform.domain.Lesson;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Lesson entity.
 */
public interface LessonSearchRepository extends ElasticsearchRepository<Lesson, Long> {
}
