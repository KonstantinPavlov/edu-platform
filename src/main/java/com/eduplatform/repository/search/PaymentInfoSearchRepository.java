package com.eduplatform.repository.search;

import com.eduplatform.domain.PaymentInfo;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the PaymentInfo entity.
 */
public interface PaymentInfoSearchRepository extends ElasticsearchRepository<PaymentInfo, Long> {
}
