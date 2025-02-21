package org.example.advancedrealestate_be.service.handler;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.dto.request.CategoryCreateRequest;
import org.example.advancedrealestate_be.dto.request.CategoryUpdateRequest;
import org.example.advancedrealestate_be.dto.request.DeleteCategoryRequest;
import org.example.advancedrealestate_be.dto.response.CategoryResponse;
import org.example.advancedrealestate_be.entity.Category;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.CategoryMapper;
import org.example.advancedrealestate_be.repository.CategoryRepository;
import org.example.advancedrealestate_be.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryServiceHandler implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Autowired
    public CategoryServiceHandler(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public String createCategory(CategoryCreateRequest request) {
        Category category = categoryMapper.toRequest(request);

        try {
            categoryRepository.save(category);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return "Đã thêm mới thành công!";
    }

    @Override
    public String updateCategory(String categoryId, CategoryUpdateRequest request) {
        try{
            Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            categoryMapper.toUpdateRequest(category,request);

            categoryRepository.save(category);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return "Đã cập nhật thành công!";
    }

    @Override
    public String deleteCategory(String categoryId) {
        try {
            categoryRepository.deleteById(categoryId);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return "Đã xóa thành công!";
    }

    @Override
    public Page<CategoryResponse> getCategory(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Category> categoryPage = categoryRepository.findAll(pageable);

        List<CategoryResponse> categoryResponses = categoryPage.getContent().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(categoryResponses, pageable, categoryPage.getTotalElements());
    }

    @Override
    public String deleteCategorys(DeleteCategoryRequest request) {
        for (String id : request.getIds()) {
            if (categoryRepository.existsById(id)) {
                categoryRepository.deleteById(id);
            } else {
                throw new RuntimeException("TypeBuilding with ID " + id + " does not exist");
            }
        }
        return "Deleted successfully!";
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(categoryMapper::toResponse).collect(Collectors.toList());
    }
}
