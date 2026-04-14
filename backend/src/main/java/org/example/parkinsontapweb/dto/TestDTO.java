package org.example.parkinsontapweb.dto;

import org.example.parkinsontapweb.entity.Test;

public class TestDTO {
    public String name;
    public String description;
    public Boolean evalAxis;
    public String dateTime;
    public Integer evaluatedId;
    public String doctorEmail;
    public Integer testId;
    public String evaluatedTypeName;
    public String doctorFirstName;
    public String doctorLastName;

    public TestDTO() {

    }

    public TestDTO(Test test) {
        this.testId = test.getId();
        this.name = test.getName();
        this.description = test.getDescription();
        this.evalAxis = test.getEvalAxis();
        this.dateTime = test.getDateTime() != null ? test.getDateTime().toString() : null;
        this.evaluatedId = test.getEvaluated() != null ? test.getEvaluated().getId() : null;
        this.doctorEmail = test.getDoctor() != null ? test.getDoctor().getEmail() : null;
        this.evaluatedTypeName = (test.getEvaluated() != null &&
                test.getEvaluated().getEvaluatedType() != null)
                ? test.getEvaluated().getEvaluatedType().getTypeName()
                : null;
        this.doctorFirstName = test.getDoctor() != null ? test.getDoctor().getFirstName() : null;
        this.doctorLastName =  test.getDoctor() != null ? test.getDoctor().getLastName() : null;
    }

    public String getDoctorFirstName() {
        return doctorFirstName;
    }

    public void setDoctorFirstName(String doctorFirstName) {
        this.doctorFirstName = doctorFirstName;
    }

    public String getDoctorLastName() {
        return doctorLastName;
    }

    public void setDoctorLastName(String doctorLastName) {
        this.doctorLastName = doctorLastName;
    }

    public String getDoctorEmail() {
        return doctorEmail;
    }

    public void setDoctorEmail(String doctorEmail) {
        this.doctorEmail = doctorEmail;
    }

    public Integer getTestId() {
        return testId;
    }

    public void setTestId(Integer testId) {
        this.testId = testId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getEvalAxis() {
        return evalAxis;
    }

    public void setEvalAxis(Boolean evalAxis) {
        this.evalAxis = evalAxis;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public Integer getEvaluatedId() {
        return evaluatedId;
    }

    public void setEvaluatedId(Integer evaluatedId) {
        this.evaluatedId = evaluatedId;
    }

    public String getEvaluatedTypeName() {
        return evaluatedTypeName;
    }

    public void setEvaluatedTypeName(String evaluatedTypeName) {
        this.evaluatedTypeName = evaluatedTypeName;
    }
}
