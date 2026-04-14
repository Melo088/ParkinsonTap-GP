package org.example.parkinsontapweb.controller;

import org.example.parkinsontapweb.dto.DataGraphDTO;
import org.example.parkinsontapweb.entity.Reading;
import org.example.parkinsontapweb.repository.ReadingRepository;
import org.example.parkinsontapweb.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/graph")
public class ReadingController {

    @Autowired
    private ReadingRepository readingRepository;

    @Autowired
    private TestRepository testRepository;

    @PreAuthorize("hasAuthority('DOCTOR')")
    @GetMapping("/{testId}")
    public ResponseEntity<List<DataGraphDTO>> getData(@PathVariable Integer testId) {
        if (testId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Reading> readings = readingRepository.findByTestId(testId);
        List<DataGraphDTO> dataList = readings.stream()
                .map(DataGraphDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dataList);
    }

    @DeleteMapping("/readings/test/{testId}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<Map<String, String>> deleteReadingsFromTest(@PathVariable Integer testId) {
        if (testId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "testId es nulo"));
        }
        if (!testRepository.existsById(testId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Test con ID " + testId + " no encontrado"));
        }

        if (!readingRepository.existsByTestId(testId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No hay lecturas para el test con ID " + testId));
        }

        readingRepository.deleteByTestId(testId);

        return ResponseEntity.ok(Map.of("message", "Lecturas eliminadas para el test " + testId));
    }

}
