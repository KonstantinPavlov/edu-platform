package com.eduplatform.service.mapper;

import com.eduplatform.domain.*;
import com.eduplatform.service.dto.NewsCommentsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity NewsComments and its DTO NewsCommentsDTO.
 */
@Mapper(componentModel = "spring", uses = {NewsMapper.class})
public interface NewsCommentsMapper extends EntityMapper<NewsCommentsDTO, NewsComments> {

    @Mapping(source = "news.id", target = "newsId")
    NewsCommentsDTO toDto(NewsComments newsComments);

    @Mapping(source = "newsId", target = "news")
    NewsComments toEntity(NewsCommentsDTO newsCommentsDTO);

    default NewsComments fromId(Long id) {
        if (id == null) {
            return null;
        }
        NewsComments newsComments = new NewsComments();
        newsComments.setId(id);
        return newsComments;
    }
}
