package org.example.parkinsontapweb.repository;

import org.example.parkinsontapweb.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
    Genre findByGenreName(String genreName);
}
