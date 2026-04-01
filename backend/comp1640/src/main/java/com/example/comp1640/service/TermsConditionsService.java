package com.example.comp1640.service;

import com.example.comp1640.dto.request.TermsConditionsRequest;
import com.example.comp1640.dto.response.TermsConditionsResponse;
import java.util.List;

public interface TermsConditionsService {
   List<TermsConditionsResponse> getAll();

   TermsConditionsResponse getCurrent();

   TermsConditionsResponse getById(Integer id);

   TermsConditionsResponse create(TermsConditionsRequest request);
}
