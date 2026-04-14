package org.example.parkinsontapweb.controller;

import org.example.parkinsontapweb.entity.Reading;
import org.example.parkinsontapweb.entity.Test;
import org.example.parkinsontapweb.repository.ReadingRepository;
import org.example.parkinsontapweb.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/esp32")
public class ESP32Controller {

    // Access to SQL functions
    @Autowired
    private TestRepository testRepository;

    @Autowired
    private ReadingRepository readingRepository;

    @PostMapping("/batch-readings")
    public ResponseEntity<?> saveBatchReadings(@RequestBody Map<String, Object> payload) {
        try {
            Integer testId = (Integer) payload.get("testId");

            Optional<Test> testOpt = testRepository.findById(testId);
            if (!testOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Test con ID " + testId + " no encontrado");
            }

            boolean yaTieneLecturas = readingRepository.existsByTestId(testId);
            if (yaTieneLecturas) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("El test ya tiene lecturas registradas. No se pueden añadir más.");
            }

            Test test = testOpt.get(); // If the test exists and does not have data, then the following is obtained

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> readingsData = (List<Map<String, Object>>) payload.get("readings");

            List<Reading> readings = new ArrayList<>();

            for (Map<String, Object> readingData : readingsData) {
                Reading reading = new Reading();
                reading.setTest(test);
                reading.setTime(((Number) readingData.get("time")).floatValue());
                reading.setAx(((Number) readingData.get("ax")).floatValue());
                reading.setAy(((Number) readingData.get("ay")).floatValue());
                reading.setAz(((Number) readingData.get("az")).floatValue());
                reading.setY(((Number) readingData.get("y")).floatValue());
                reading.setP(((Number) readingData.get("p")).floatValue());
                reading.setR(((Number) readingData.get("r")).floatValue());

                readings.add(reading);
            }

            readingRepository.saveAll(readings);

            return ResponseEntity.ok("Se guardaron " + readings.size() + " lecturas para el test " + testId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar las lecturas: " + e.getMessage());
        }
    }
}
