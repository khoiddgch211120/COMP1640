package com.example.comp1640.service;

import com.example.comp1640.dto.request.TermsConditionsRequest;
import com.example.comp1640.dto.response.TermsConditionsResponse;

public interface TermsConditionsService {

    TermsConditionsResponse getLatest();

    TermsConditionsResponse create(TermsConditionsRequest request);

    void accept();
}
