package org.example.parkinsontapweb.dto;

public class DoctorUpdateDTO {
    private String firstName;
    private String lastName;
    private String speciality;
    private String medicalCenter;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getSpeciality() { return speciality; }
    public void setSpeciality(String speciality) { this.speciality = speciality; }
    public String getMedicalCenter() { return medicalCenter; }
    public void setMedicalCenter(String medicalCenter) { this.medicalCenter = medicalCenter; }
}
