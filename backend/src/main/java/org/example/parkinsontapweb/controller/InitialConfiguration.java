package org.example.parkinsontapweb.controller;

import jakarta.annotation.PostConstruct;
import org.example.parkinsontapweb.entity.*;
import org.example.parkinsontapweb.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class InitialConfiguration {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private EvaluatedTypeRepository evaluatedTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EvaluatedRepository evaluatedRepository;

    @PostConstruct
    public void init() {
        // Crear roles si no existen (solo si la tabla está vacía)
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setRoleName("ADMIN");
            roleRepository.save(adminRole);

            Role doctorRole = new Role();
            doctorRole.setRoleName("DOCTOR");
            roleRepository.save(doctorRole);

            // Crear géneros
            Genre masculino = new Genre();
            masculino.setGenreName("MASCULINO");
            genreRepository.save(masculino);

            Genre femenino = new Genre();
            femenino.setGenreName("FEMENINO");
            genreRepository.save(femenino);

            Genre otro = new Genre();
            otro.setGenreName("OTRO");
            genreRepository.save(otro);

            // Crear tipos de evaluados
            EvaluatedType pacientes = new EvaluatedType();
            pacientes.setTypeName("PACIENTES");
            evaluatedTypeRepository.save(pacientes);

            EvaluatedType controles = new EvaluatedType();
            controles.setTypeName("CONTROLES");
            evaluatedTypeRepository.save(controles);
        }

        // Crear usuario admin solo si no existe ya un admin con ese email
        if (!userRepository.existsByEmail("admin3")) {
            // Busca por nombre, no por ID hardcodeado
            Optional<Role> optionalAdminRole = roleRepository.findByRoleName("ADMIN");

            if (optionalAdminRole.isPresent()) {
                Role adminRole = optionalAdminRole.get();
                Admin admin = new Admin();
                admin.setEmail("admin3");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(adminRole);
                userRepository.save(admin);
            }
        }
    }

}