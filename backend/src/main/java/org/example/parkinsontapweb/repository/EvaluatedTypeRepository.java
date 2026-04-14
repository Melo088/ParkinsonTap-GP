package org.example.parkinsontapweb.repository;

import org.example.parkinsontapweb.entity.EvaluatedType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluatedTypeRepository extends JpaRepository<EvaluatedType, Integer> {
    EvaluatedType findByTypeNameContainingIgnoreCase(String typeName);
}

