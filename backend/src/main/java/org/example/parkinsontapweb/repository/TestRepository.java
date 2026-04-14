package org.example.parkinsontapweb.repository;

import org.example.parkinsontapweb.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestRepository extends JpaRepository<Test, Integer>{
    List<Test> findByDoctorId(Integer doctorId);


}
