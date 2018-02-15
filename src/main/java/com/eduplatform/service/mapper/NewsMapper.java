package com.eduplatform.service.mapper;

import com.eduplatform.domain.*;
import com.eduplatform.service.dto.NewsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity News and its DTO NewsDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface NewsMapper extends EntityMapper<NewsDTO, News> {


    @Mapping(target = "resources", ignore = true)
    @Mapping(target = "comments", ignore = true)
    News toEntity(NewsDTO newsDTO);

    default News fromId(Long id) {
        if (id == null) {
            return null;
        }
        News news = new News();
        news.setId(id);
        return news;
    }
}
