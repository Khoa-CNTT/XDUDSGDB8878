package org.example.advancedrealestate_be.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

public class ContractIdRequest {
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
