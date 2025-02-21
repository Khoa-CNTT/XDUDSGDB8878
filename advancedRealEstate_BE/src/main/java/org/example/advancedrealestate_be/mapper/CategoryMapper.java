package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.CategoryCreateRequest;
import org.example.advancedrealestate_be.dto.request.CategoryUpdateRequest;
import org.example.advancedrealestate_be.dto.response.CategoryResponse;
import org.example.advancedrealestate_be.entity.Category;

public interface CategoryMapper {
    Category toRequest(CategoryCreateRequest request);
    void toUpdateRequest(Category category, CategoryUpdateRequest request);
    CategoryResponse toResponse(Category category);
}
