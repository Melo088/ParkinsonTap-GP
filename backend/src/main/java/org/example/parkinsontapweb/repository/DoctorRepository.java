package org.example.parkinsontapweb.repository;

import org.example.parkinsontapweb.entity.Doctor;
import org.example.parkinsontapweb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Boolean existsByEmail(String email);
    Doctor findByEmail(String email);

    @Query("SELECT d.id FROM Doctor d WHERE d.email = :email")
    Integer findIdByEmail(@Param("email") String email);

}
