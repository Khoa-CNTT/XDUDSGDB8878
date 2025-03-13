package org.example.advancedrealestate_be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "role_permissions")
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID tự động tăng
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "role_id",                    // Cột "role_id" trong bảng hiện tại
            referencedColumnName = "id"          // Tham chiếu tới cột "id" trong bảng "roles"
    )
    private Role role;

    @ManyToOne
    @JoinColumn(
            name = "permission_id",              // Cột "permission_id" trong bảng hiện tại
            referencedColumnName = "id"          // Tham chiếu tới cột "id" trong bảng "permissions"
    )
    private Permission permission;
}
