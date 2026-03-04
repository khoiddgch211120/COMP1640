package com.example.comp1640.service;

import com.example.comp1640.dto.AcademicYearDTO;
import com.example.comp1640.entity.AcademicYear;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.AcademicYearRepository;
import com.example.comp1640.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicYearService {

    private final AcademicYearRepository academicYearRepository;
    private final UserRepository userRepository;

    public List<AcademicYearDTO> getAllAcademicYears() {
        return academicYearRepository.findAllByOrderByYearIdDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AcademicYearDTO getAcademicYearById(Integer id) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found with id: " + id));
        return convertToDTO(academicYear);
    }

    @Transactional
    public AcademicYearDTO createAcademicYear(AcademicYearDTO dto, Integer userId) {
        User createdBy = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        AcademicYear academicYear = new AcademicYear();
        academicYear.setYearLabel(dto.getYearLabel());
        academicYear.setIdeaClosureDate(dto.getIdeaClosureDate());
        academicYear.setFinalClosureDate(dto.getFinalClosureDate());
        academicYear.setCreatedBy(createdBy);
        academicYear.setCreatedAt(LocalDateTime.now());

        AcademicYear saved = academicYearRepository.save(academicYear);
        return convertToDTO(saved);
    }

    @Transactional
    public AcademicYearDTO updateClosureDates(Integer id, LocalDateTime ideaClosureDate, LocalDateTime finalClosureDate) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found with id: " + id));

        if (ideaClosureDate != null) {
            academicYear.setIdeaClosureDate(ideaClosureDate.toLocalDate());
        }
        if (finalClosureDate != null) {
            academicYear.setFinalClosureDate(finalClosureDate.toLocalDate());
        }

        AcademicYear saved = academicYearRepository.save(academicYear);
        return convertToDTO(saved);
    }

    private AcademicYearDTO convertToDTO(AcademicYear academicYear) {
        AcademicYearDTO dto = new AcademicYearDTO();
        dto.setYearId(academicYear.getYearId());
        dto.setYearLabel(academicYear.getYearLabel());
        dto.setIdeaClosureDate(academicYear.getIdeaClosureDate());
        dto.setFinalClosureDate(academicYear.getFinalClosureDate());
        dto.setCreatedAt(academicYear.getCreatedAt());
        if (academicYear.getCreatedBy() != null) {
            dto.setCreatedByName(academicYear.getCreatedBy().getFullName());
        }
        return dto;
    }
}

