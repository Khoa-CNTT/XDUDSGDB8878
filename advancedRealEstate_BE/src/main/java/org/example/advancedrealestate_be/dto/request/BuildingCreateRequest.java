package org.example.advancedrealestate_be.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BuildingCreateRequest {

    private String id_type_building;
    private String id_map;
    private String description;
    private String structure;
    //    private List<MultipartFile> image;
    private String name;
    private int status;
    private int number_of_basement;
    private String acreage;

    private List<MultipartFile> image;

    // Getter và Setter cho image
    public List<MultipartFile> getImage() {
        return image;
    }

    public void setImage(List<MultipartFile> image) {
        this.image = image;
    }
}
