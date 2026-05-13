package org.example.parkinsontapweb.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AnalysisDTO {

    // Test metadata
    private Integer testId;
    private String testName;
    private String testDateTime;
    private String testDescription;
    private Boolean evalAxis;

    // Doctor info
    private String doctorFullName;
    private String doctorSpeciality;
    private String doctorMedicalCenter;
    private String doctorEmail;

    // Patient info
    private String patientName;
    private Integer patientAge;
    private String patientGender;
    private String evaluatedType;
    private Double patientBmi;
    private String patientNotes;

    // Accelerometer metrics (rms* include gravity — informativo, no usar para temblor)
    private Double rmsTotal;
    private Double rmsX;
    private Double rmsY;
    private Double rmsZ;
    private Double stdX;
    private Double stdY;
    private Double stdZ;
    private Double rangeX;
    private Double rangeY;
    private Double rangeZ;
    private Double peakToPeakMagnitude;

    // Dynamic tremor amplitude: RMS of deviations (gravity-free)
    private Double tremorRms;

    // Rotation metrics
    private Double stdYaw;
    private Double stdPitch;
    private Double stdRoll;
    private Double rangeYaw;
    private Double rangePitch;
    private Double rangeRoll;

    // Composite score
    private Double tremorIndex;
    private String tremorSeverity;

    // Raw readings for charts
    private List<DataGraphDTO> readings;
}
