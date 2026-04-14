package org.example.parkinsontapweb.controller;

import org.example.parkinsontapweb.dto.EvaluatedAcqDTO;
import org.example.parkinsontapweb.dto.EvaluatedDTO;
import org.example.parkinsontapweb.entity.*;
import org.example.parkinsontapweb.mapper.EvaluatedMapper;
import org.example.parkinsontapweb.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RequestMapping("/api/evaluated")
@RestController
public class EvaluatedController {
    @Autowired
    private EvaluatedRepository evaluatedRepository;

    @Autowired
    private EvaluatedTypeRepository evaluatedTypeRepository;

    @Autowired
    private GenreRepository genreRepository;
    @Autowired
    private ReadingRepository readingRepository;
    @Autowired
    private TestRepository testRepository;

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<Map<String, Object>> registerEvaluated(@RequestBody EvaluatedDTO evaluatedDTO) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate input
            if (evaluatedDTO.getName() == null || evaluatedDTO.getName().trim().isEmpty()) {
                response.put("error", "Name is required");
                return ResponseEntity.badRequest().body(response);
            }

            Evaluated evaluated = new Evaluated();
            evaluated.setName(evaluatedDTO.getName());
            evaluated.setHeight(evaluatedDTO.getHeight());
            evaluated.setWeight(evaluatedDTO.getWeight());
            evaluated.setBirthDate(evaluatedDTO.getBirthDate());
            evaluated.setNotes(evaluatedDTO.getNotes());

            EvaluatedType evaluatedType;
            if ("PACIENTES".equalsIgnoreCase(evaluatedDTO.getEvaluatedTypeName())) {
                evaluatedType = evaluatedTypeRepository.findByTypeNameContainingIgnoreCase("PACIENTES");
                if (evaluatedType == null) {
                    response.put("error", "PACIENTES type not found");
                    return ResponseEntity.badRequest().body(response);
                }
                evaluated.setEvaluatedType(evaluatedType);
                evaluated.setStatus(evaluatedDTO.getStatus() != null ? evaluatedDTO.getStatus() : false);
            } else if ("CONTROLES".equalsIgnoreCase(evaluatedDTO.getEvaluatedTypeName())) {
                evaluatedType = evaluatedTypeRepository.findByTypeNameContainingIgnoreCase("CONTROLES");
                if (evaluatedType == null) {
                    response.put("error", "CONTROLES type not found");
                    return ResponseEntity.badRequest().body(response);
                }
                evaluated.setEvaluatedType(evaluatedType);
                evaluated.setStatus(false);
            } else {
                response.put("error", "Invalid evaluated type. Must be 'PACIENTES' or 'CONTROLES'");
                return ResponseEntity.badRequest().body(response);
            }

            String genreName = evaluatedDTO.getGenreName();
            if (genreName == null) {
                response.put("error", "Genre name cannot be null.");
                return ResponseEntity.badRequest().body(response);
            }

            Genre genre;
            switch (genreName) {
                case "MASCULINO", "FEMENINO", "OTRO" -> {
                    genre = genreRepository.findByGenreName(genreName);
                }
                default -> {
                    genre = null;
                }
            }
            if (genre != null) {
                evaluated.setGenre(genre);
            } else {
                response.put("error", "Invalid genre name. Must be 'MASCULINO', 'FEMENINO' or 'OTRO'");
                return ResponseEntity.badRequest().body(response);
            }
            Evaluated savedEvaluated = evaluatedRepository.save(evaluated);

            response.put("success", true);
            response.put("message", "Evaluated successfully registered");
            response.put("evaluatedId", savedEvaluated.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "An error occurred while registering evaluated: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/data")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public List<EvaluatedDTO> listAll() {

        List<Evaluated> evaluatedList = evaluatedRepository.findAll();
        return EvaluatedMapper.toDTOList(evaluatedList);
    }

    @GetMapping("/search")
    public List<Evaluated> searchByName(@RequestParam String name) {
        return evaluatedRepository.findByNameContainingIgnoreCase(name);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<Map<String, String>> deleteEvaluated(@PathVariable Integer id) {
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "id is required"));
        }

        Optional<Evaluated> optionalEvaluated = evaluatedRepository.findById(id);

        if (optionalEvaluated.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Evaluated not found"));
        }

        evaluatedRepository.delete(optionalEvaluated.get());

        return ResponseEntity.ok(Map.of("message", "Evaluated successfully deleted"));
    }

}
