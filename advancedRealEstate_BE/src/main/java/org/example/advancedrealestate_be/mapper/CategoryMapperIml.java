package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.CategoryCreateRequest;
import org.example.advancedrealestate_be.dto.request.CategoryUpdateRequest;
import org.example.advancedrealestate_be.dto.response.CategoryResponse;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.entity.Category;
import org.example.advancedrealestate_be.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapperIml implements CategoryMapper {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryMapperIml(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category toRequest(CategoryCreateRequest request) {
        if(request == null) {
            return null;
        }

        Category category = new Category();
        category.setCategory_name(request.getCategory_name());
        category.setStatus(request.getStatus());

        return category;
    }

    @Override
    public void toUpdateRequest(Category category, CategoryUpdateRequest request) {
        if (category == null || request == null) {
            return;
        }

        if (request.getCategory_name() != null) {
            category.setCategory_name(request.getCategory_name());
        }

        if (request.getStatus() != null) {
            category.setStatus(request.getStatus());
        }
    }

    @Override
    public CategoryResponse toResponse(Category category) {
        if(category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .category_name(category.getCategory_name())
                .status(category.getStatus())
                .build();
    }
}
