package org.example.parkinsontapweb.repository;

import org.example.parkinsontapweb.entity.Evaluated;
import org.example.parkinsontapweb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvaluatedRepository extends JpaRepository<Evaluated, Integer> {

    List<Evaluated> findByNameContainingIgnoreCase(String name);
}
