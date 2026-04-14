package org.example.parkinsontapweb.dto;

import lombok.Getter;
import lombok.Setter;
import org.example.parkinsontapweb.entity.Reading;

@Getter
@Setter
public class DataGraphDTO {
    private Float timestamp;
    private double aX;
    private double aY;
    private double aZ;

    private double p;
    private double r;
    private double y;

    private Integer testId;

    public DataGraphDTO(Reading reading) {
        this.timestamp = reading.getTime();
        this.aX = reading.getAx();
        this.aY = reading.getAy();
        this.aZ = reading.getAz();
        this.p = reading.getP();
        this.r = reading.getR();
        this.y = reading.getY();
        this.testId = reading.getTest().getId();
    }

}