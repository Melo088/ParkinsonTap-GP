package org.example.parkinsontapweb.repository;

import jakarta.transaction.Transactional;
import org.example.parkinsontapweb.entity.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReadingRepository extends JpaRepository<Reading, Integer> {
    List<Reading> findByTestId(Integer testId);
    boolean existsByTestId(Integer testId);

    @Transactional
    @Modifying
    @Query
    void deleteByTestId(Integer testId);

}



