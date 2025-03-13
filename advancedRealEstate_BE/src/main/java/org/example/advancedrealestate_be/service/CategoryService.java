package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.CategoryResponse;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CategoryService {
    String  createCategory(CategoryCreateRequest request);
    String  updateCategory(String categoryId, CategoryUpdateRequest request);
    String  deleteCategory(String categoryId);
    Page<CategoryResponse>  getCategory(int page, int size);
    String  deleteCategorys(DeleteCategoryRequest request);
    List<CategoryResponse>  getAllCategories();
}
