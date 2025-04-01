package org.example.advancedrealestate_be.dto;

import lombok.*;

import java.io.Serial;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PasswordDTO extends AbstractDTO<PasswordDTO> {

    @Serial
    private static final long serialVersionUID = 8835146939192307340L;

    private String oldPassword;
    private String newPassword;
    private String confirmPassword;

}
