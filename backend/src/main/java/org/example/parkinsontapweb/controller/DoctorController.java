package org.example.parkinsontapweb.controller;

import org.example.parkinsontapweb.dto.DoctorDTO;
import org.example.parkinsontapweb.entity.Doctor;
import org.example.parkinsontapweb.entity.Role;
import org.example.parkinsontapweb.entity.Test;
import org.example.parkinsontapweb.repository.DoctorRepository;
import org.example.parkinsontapweb.repository.EvaluatedRepository;
import org.example.parkinsontapweb.repository.RoleRepository;
import org.example.parkinsontapweb.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final EvaluatedRepository evaluatedRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final TestRepository testRepository;

    @Autowired
    public DoctorController(
            DoctorRepository doctorRepository,
            EvaluatedRepository evaluatedRepository,
            PasswordEncoder passwordEncoder,
            RoleRepository roleRepository,
            TestRepository testRepository) {
        this.doctorRepository = doctorRepository;
        this.evaluatedRepository = evaluatedRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.testRepository = testRepository;
    }

    // Endpoint para obtener todos los doctores - Solo ADMIN
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        List<DoctorDTO> doctorDtos = doctors.stream()
                .map(DoctorDTO::new)
                .toList();
        return ResponseEntity.ok(doctorDtos);
    }

    // Method to register doctors - Solo ADMIN
    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ADMIN')") // Cambiado a hasRole
    public ResponseEntity<Map<String, String>> registerDoctor(@RequestBody Doctor doctor) {
        if (doctorRepository.existsByEmail(doctor.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Doctor already exists"));
        }

        Role role = roleRepository.findByRoleName("DOCTOR")
                .orElseThrow(() -> new RuntimeException("Error: Rol DOCTOR no encontrado en la DB"));

        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        doctor.setRole(role);
        doctorRepository.save(doctor);
        return ResponseEntity.ok(Map.of("message", "Doctor was registered successfully"));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable Integer id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Doctor not found"));
        }

        // Buscar tests relacionados con ese doctor
        List<Test> myTests = testRepository.findByDoctorId(id);

        if (!myTests.isEmpty()) {
            // Desvincular doctor de cada test
            for (Test test : myTests) {
                test.setDoctor(null);
            }
            // Guardar los tests actualizados
            testRepository.saveAll(myTests);
        }
        // borrar doctor
        doctorRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "Doctor was deleted"));
    }

}