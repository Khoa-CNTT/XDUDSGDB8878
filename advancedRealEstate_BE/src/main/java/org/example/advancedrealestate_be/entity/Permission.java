package org.example.advancedrealestate_be.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "permissions") // Bảng lưu thông tin các quyền
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID tự động tăng
    Integer id;

    String permissionName;
    String link;

    // Một Permission có thể liên kết với nhiều RolePermission
    @OneToMany(mappedBy = "permission")
    private Set<RolePermission> rolePermissions;
}
