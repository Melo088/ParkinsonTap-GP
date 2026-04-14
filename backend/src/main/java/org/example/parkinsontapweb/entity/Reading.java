package org.example.parkinsontapweb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "reading")
public class Reading {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "testId")
    private Test test;

    private Float time;
    private Float ax;
    private Float ay;
    private Float az;
    private Float y;
    private Float p;
    private Float r;

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }

    public Float getTime() {
        return time;
    }

    public void setTime(Float time) {
        this.time = time;
    }

    public Float getAx() {
        return ax;
    }

    public void setAx(Float ax) {
        this.ax = ax;
    }

    public Float getAy() {
        return ay;
    }

    public void setAy(Float ay) {
        this.ay = ay;
    }

    public Float getAz() {
        return az;
    }

    public void setAz(Float az) {
        this.az = az;
    }

    public Float getY() {
        return y;
    }

    public void setY(Float y) {
        this.y = y;
    }

    public Float getP() {
        return p;
    }

    public void setP(Float p) {
        this.p = p;
    }

    public Float getR() {
        return r;
    }

    public void setR(Float r) {
        this.r = r;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }
}
