package org.example.advancedrealestate_be.dto.request;

import lombok.*;

import java.util.List;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleRequest {


    private List<Role> roles;

    @Data
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Role {
        private String name;
//        private List<Permission> permissions;
    }
//    @Data
//    @Getter
//    @Setter
//    @Builder
//    @NoArgsConstructor
//    @AllArgsConstructor
//    public static class Permission {
//        private String name;
//    }

}
