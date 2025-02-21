package org.example.advancedrealestate_be.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.advancedrealestate_be.entity.Contracts;
import org.joda.time.DateTime;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceRequest {
    private LocalDate expire_date_payment; // Expiration date for payment
    private double amount;
    private String contractId; // ID of the associated contract
}
