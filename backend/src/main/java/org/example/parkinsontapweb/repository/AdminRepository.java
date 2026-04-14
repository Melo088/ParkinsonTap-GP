package org.example.parkinsontapweb.repository;

import org.example.parkinsontapweb.entity.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Administrator, Integer> {
}
