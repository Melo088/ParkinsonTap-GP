package org.example.parkinsontapweb.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "test")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "doctorId")
    private User doctor;

    @ManyToOne
    @JoinColumn (name = "evaluatedId")
    private Evaluated evaluated;

    private String name;
    private LocalDateTime dateTime;
    private Boolean evalAxis;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <Reading> readings;


    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public User getDoctor() {
        return doctor;
    }

    public void setDoctor(User doctor) {
        this.doctor = doctor;
    }

    public Evaluated getEvaluated() {
        return evaluated;
    }

    public void setEvaluated(Evaluated evaluated) {
        this.evaluated = evaluated;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Boolean getEvalAxis() {
        return evalAxis;
    }

    public void setEvalAxis(Boolean evalAxis) {
        this.evalAxis = evalAxis;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Reading> getReadings() {
        return readings;
    }

    public void setReadings(List<Reading> readings) {
        this.readings = readings;
    }
}
