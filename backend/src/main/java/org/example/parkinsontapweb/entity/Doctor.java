package org.example.parkinsontapweb.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@DiscriminatorValue("DOCTOR")
public class Doctor extends User{
    private String speciality;
    private String medicalCenter;


    public String getSpeciality() {
        return speciality;
    }

    public void setSpeciality(String speciality) {
        this.speciality = speciality;
    }

    public String getMedicalCenter() {
        return medicalCenter;
    }

    public void setMedicalCenter(String medicalCenter) {
        this.medicalCenter = medicalCenter;
    }
}
