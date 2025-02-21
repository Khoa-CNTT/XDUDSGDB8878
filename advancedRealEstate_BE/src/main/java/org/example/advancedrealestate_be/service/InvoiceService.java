package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.dto.request.InvoiceRequest;
import org.example.advancedrealestate_be.dto.response.InvoiceResponse;

import java.util.List;

public interface InvoiceService {
    String createInvoice(InvoiceRequest request);
    InvoiceResponse getInvoiceById(String id);
    List<InvoiceResponse> getAllInvoice();
    String updateInvoice(String id, InvoiceRequest request);
    String deleteInvoice(String id);
}
