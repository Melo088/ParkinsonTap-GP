package org.example.parkinsontapweb.dto;

import java.time.LocalDate;

public class EvaluatedAcqDTO {
    private String name;
    private Float weight;
    private Float height;
    private LocalDate birthDate;
    private String notes;
    private Boolean status;
    private String genreName;
    private String evaluatedTypeName;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getWeight() {
        return weight;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public Float getHeight() {
        return height;
    }

    public void setHeight(Float height) {
        this.height = height;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getGenreName() {
        return genreName;
    }

    public void setGenreName(String genreName) {
        this.genreName = genreName;
    }

    public String getEvaluatedTypeName() {
        return evaluatedTypeName;
    }

    public void setEvaluatedTypeName(String evaluatedTypeName) {
        this.evaluatedTypeName = evaluatedTypeName;
    }
}


