package com.eduplatform.repository;

import com.eduplatform.domain.NewsComments;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the NewsComments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NewsCommentsRepository extends JpaRepository<NewsComments, Long> {

}
