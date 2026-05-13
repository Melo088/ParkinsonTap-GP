package org.example.parkinsontapweb.controller;

import org.example.parkinsontapweb.dto.DoctorDTO;
import org.example.parkinsontapweb.dto.DoctorUpdateDTO;
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
import org.springframework.security.core.Authentication;
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

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        List<DoctorDTO> doctorDtos = doctors.stream()
                .map(DoctorDTO::new)
                .toList();
        return ResponseEntity.ok(doctorDtos);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<?> getMyProfile(Authentication auth) {
        Doctor doctor = doctorRepository.findByEmail(auth.getName());
        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Doctor not found"));
        }
        return ResponseEntity.ok(new DoctorDTO(doctor));
    }

    @PutMapping("/me")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<?> updateMyProfile(@RequestBody DoctorUpdateDTO dto, Authentication auth) {
        Doctor doctor = doctorRepository.findByEmail(auth.getName());
        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Doctor not found"));
        }
        if (dto.getFirstName() != null && !dto.getFirstName().isBlank())
            doctor.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null && !dto.getLastName().isBlank())
            doctor.setLastName(dto.getLastName());
        if (dto.getSpeciality() != null)
            doctor.setSpeciality(dto.getSpeciality());
        if (dto.getMedicalCenter() != null)
            doctor.setMedicalCenter(dto.getMedicalCenter());
        doctorRepository.save(doctor);
        return ResponseEntity.ok(new DoctorDTO(doctor));
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ADMIN')")
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

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateDoctor(@PathVariable Integer id, @RequestBody DoctorUpdateDTO dto) {
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Doctor not found"));
        }
        if (dto.getFirstName() != null && !dto.getFirstName().isBlank())
            doctor.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null && !dto.getLastName().isBlank())
            doctor.setLastName(dto.getLastName());
        if (dto.getSpeciality() != null)
            doctor.setSpeciality(dto.getSpeciality());
        if (dto.getMedicalCenter() != null)
            doctor.setMedicalCenter(dto.getMedicalCenter());
        doctorRepository.save(doctor);
        return ResponseEntity.ok(new DoctorDTO(doctor));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable Integer id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Doctor not found"));
        }

        List<Test> myTests = testRepository.findByDoctorId(id);
        if (!myTests.isEmpty()) {
            for (Test test : myTests) {
                test.setDoctor(null);
            }
            testRepository.saveAll(myTests);
        }
        doctorRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "Doctor was deleted"));
    }
}
