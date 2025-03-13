package org.example.advancedrealestate_be.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles") // Bảng lưu thông tin các vai trò
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    String id;
    String role_name;
    String role_type;
    Integer status;

    // Một Role có thể liên kết với nhiều RolePermission
    @OneToMany(mappedBy = "role")
    private Set<RolePermission> rolePermissions;

    // Quan hệ với User (nếu cần)
    @OneToMany(mappedBy = "role")
    private Set<User> users;
}
