package org.example.parkinsontapweb.controller;

import org.example.parkinsontapweb.dto.DoctorDTO;
import org.example.parkinsontapweb.dto.TestDTO;
import org.example.parkinsontapweb.entity.Doctor;
import org.example.parkinsontapweb.entity.Evaluated;
import org.example.parkinsontapweb.entity.Reading;
import org.example.parkinsontapweb.entity.Test;
import org.example.parkinsontapweb.repository.DoctorRepository;
import org.example.parkinsontapweb.repository.EvaluatedRepository;
import org.example.parkinsontapweb.repository.ReadingRepository;
import org.example.parkinsontapweb.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private EvaluatedRepository evaluatedRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private ReadingRepository readingRepository;

    @PostMapping("/save")
    public ResponseEntity<?> saveTest(@RequestBody TestDTO testDTO) {
        Map<String, Object> response = new HashMap<>();

        if (testDTO.doctorEmail == null || testDTO.evaluatedId == null || testDTO.name == null || testDTO.dateTime == null) {
            response.put("error", "Faltan campos obligatorios");
            return ResponseEntity.badRequest().body(response);
        }

        // Buscar doctor por email
        Doctor doctor = doctorRepository.findByEmail(testDTO.doctorEmail);
        if (doctor == null) {
            response.put("error", "El doctor no existe");
            return ResponseEntity.badRequest().body(response);
        }

        // Buscar evaluado por id
        Evaluated evaluated = evaluatedRepository.findById(testDTO.evaluatedId).orElse(null);
        if (evaluated == null) {
            response.put("error", "El evaluado no existe");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Parsear fecha
        LocalDateTime parsedDate;
        try {
            parsedDate = LocalDateTime.parse(testDTO.dateTime);
        } catch (DateTimeParseException e) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
                parsedDate = LocalDateTime.parse(testDTO.dateTime, formatter);
            } catch (Exception ex) {
                response.put("error", "Formato de fecha inválido.");
                return ResponseEntity.badRequest().body(response);
            }
        }
        // Guardar Test
        try {
            Test test = new Test();
            test.setDoctor(doctor);
            test.setName(testDTO.name);
            test.setDescription(testDTO.description);
            test.setEvalAxis(testDTO.evalAxis);
            test.setDateTime(parsedDate);
            test.setEvaluated(evaluated);

            Test savedTest = testRepository.save(test);

            response.put("message", "Test guardado con éxito");
            response.put("testId", savedTest.getId());
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            response.put("error", "Error al guardar el test: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<Map<String, String>> deleteTest(@PathVariable Integer id) {
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Test ID is required"));
        }
        Optional<Test> optionalTest = testRepository.findById(id);
        if (optionalTest.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Test not found"));
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentDoctorEmail = authentication.getName();
        Test test = optionalTest.get();

        if (test.getDoctor() == null || currentDoctorEmail.equals(test.getDoctor().getEmail())){
            try{
                testRepository.delete(test);
                return ResponseEntity.ok(Map.of("message", "Test successfully deleted"));
            }catch (Exception e){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to delete test" +  e.getMessage()));
            }
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not the doctor who created the test"));
        }

    }
    // Endpoint para obtener todos test
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<List<TestDTO>> getAllTests() {
        List<Test> tests = testRepository.findAll();
        List<TestDTO> testDTOS = tests.stream()
                .map(TestDTO::new)
                .toList();
        return ResponseEntity.ok(testDTOS);
    }

    @GetMapping("/hasData/{id}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<Map<String, Object>> hasData(@PathVariable Integer id) {
        boolean tieneLecturas = readingRepository.existsByTestId(id);

        Map<String, Object> response = new HashMap<>();
        response.put("hasData", tieneLecturas);

        return ResponseEntity.ok(response);
    }




}