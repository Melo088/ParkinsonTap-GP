package org.example.parkinsontapweb.service;

import org.example.parkinsontapweb.dto.AnalysisDTO;
import org.example.parkinsontapweb.dto.DataGraphDTO;
import org.example.parkinsontapweb.entity.Doctor;
import org.example.parkinsontapweb.entity.Evaluated;
import org.example.parkinsontapweb.entity.Reading;
import org.example.parkinsontapweb.entity.Test;
import org.example.parkinsontapweb.entity.User;
import org.example.parkinsontapweb.repository.ReadingRepository;
import org.example.parkinsontapweb.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnalysisService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private ReadingRepository readingRepository;

    public Optional<AnalysisDTO> buildAnalysis(Integer testId) {
        Optional<Test> optTest = testRepository.findById(testId);
        if (optTest.isEmpty()) return Optional.empty();

        Test test = optTest.get();
        List<Reading> readings = readingRepository.findByTestId(testId);

        AnalysisDTO dto = new AnalysisDTO();
        populateTestMeta(dto, test);
        populateDoctorInfo(dto, test);
        populatePatientInfo(dto, test);

        if (!readings.isEmpty()) {
            computeAccelerometerMetrics(dto, readings);
            computeRotationMetrics(dto, readings);
            computeTremorIndex(dto);
        }

        dto.setReadings(readings.stream().map(DataGraphDTO::new).collect(Collectors.toList()));
        return Optional.of(dto);
    }

    private void populateTestMeta(AnalysisDTO dto, Test test) {
        dto.setTestId(test.getId());
        dto.setTestName(test.getName());
        dto.setTestDescription(test.getDescription());
        dto.setEvalAxis(test.getEvalAxis());
        if (test.getDateTime() != null) {
            dto.setTestDateTime(test.getDateTime().toString());
        }
    }

    private void populateDoctorInfo(AnalysisDTO dto, Test test) {
        User user = test.getDoctor();
        if (user == null) return;
        dto.setDoctorEmail(user.getEmail());
        dto.setDoctorFullName(user.getFirstName() + " " + user.getLastName());
        if (user instanceof Doctor d) {
            dto.setDoctorSpeciality(d.getSpeciality());
            dto.setDoctorMedicalCenter(d.getMedicalCenter());
        }
    }

    private void populatePatientInfo(AnalysisDTO dto, Test test) {
        Evaluated ev = test.getEvaluated();
        if (ev == null) return;
        dto.setPatientName(ev.getName());
        dto.setPatientNotes(ev.getNotes());
        if (ev.getGenre() != null) dto.setPatientGender(ev.getGenre().getGenreName());
        if (ev.getEvaluatedType() != null) dto.setEvaluatedType(ev.getEvaluatedType().getTypeName());
        if (ev.getBirthDate() != null) {
            dto.setPatientAge(Period.between(ev.getBirthDate(), LocalDate.now()).getYears());
        }
        if (ev.getWeight() != null && ev.getHeight() != null && ev.getHeight() > 0) {
            double h = ev.getHeight();
            dto.setPatientBmi(round(ev.getWeight() / (h * h)));
        }
    }

    private void computeAccelerometerMetrics(AnalysisDTO dto, List<Reading> readings) {
        int n = readings.size();
        double sumSqX = 0, sumSqY = 0, sumSqZ = 0;
        double sumX = 0, sumY = 0, sumZ = 0;
        double minX = Double.MAX_VALUE, maxX = -Double.MAX_VALUE;
        double minY = Double.MAX_VALUE, maxY = -Double.MAX_VALUE;
        double minZ = Double.MAX_VALUE, maxZ = -Double.MAX_VALUE;
        double minMag = Double.MAX_VALUE, maxMag = -Double.MAX_VALUE;

        for (Reading r : readings) {
            double ax = r.getAx(), ay = r.getAy(), az = r.getAz();
            sumSqX += ax * ax; sumSqY += ay * ay; sumSqZ += az * az;
            sumX += ax; sumY += ay; sumZ += az;
            if (ax < minX) minX = ax; if (ax > maxX) maxX = ax;
            if (ay < minY) minY = ay; if (ay > maxY) maxY = ay;
            if (az < minZ) minZ = az; if (az > maxZ) maxZ = az;
            double mag = Math.sqrt(ax * ax + ay * ay + az * az);
            if (mag < minMag) minMag = mag; if (mag > maxMag) maxMag = mag;
        }

        dto.setRmsX(round(Math.sqrt(sumSqX / n)));
        dto.setRmsY(round(Math.sqrt(sumSqY / n)));
        dto.setRmsZ(round(Math.sqrt(sumSqZ / n)));
        dto.setRmsTotal(round(Math.sqrt((sumSqX + sumSqY + sumSqZ) / n)));
        dto.setRangeX(round(maxX - minX));
        dto.setRangeY(round(maxY - minY));
        dto.setRangeZ(round(maxZ - minZ));
        dto.setPeakToPeakMagnitude(round(maxMag - minMag));

        double meanX = sumX / n, meanY = sumY / n, meanZ = sumZ / n;
        double varX = 0, varY = 0, varZ = 0;
        for (Reading r : readings) {
            varX += Math.pow(r.getAx() - meanX, 2);
            varY += Math.pow(r.getAy() - meanY, 2);
            varZ += Math.pow(r.getAz() - meanZ, 2);
        }
        dto.setStdX(round(Math.sqrt(varX / n)));
        dto.setStdY(round(Math.sqrt(varY / n)));
        dto.setStdZ(round(Math.sqrt(varZ / n)));
    }

    private void computeRotationMetrics(AnalysisDTO dto, List<Reading> readings) {
        int n = readings.size();
        double sumYaw = 0, sumPitch = 0, sumRoll = 0;
        double minYaw = Double.MAX_VALUE, maxYaw = -Double.MAX_VALUE;
        double minPitch = Double.MAX_VALUE, maxPitch = -Double.MAX_VALUE;
        double minRoll = Double.MAX_VALUE, maxRoll = -Double.MAX_VALUE;

        for (Reading r : readings) {
            double yaw = r.getY(), pitch = r.getP(), roll = r.getR();
            sumYaw += yaw; sumPitch += pitch; sumRoll += roll;
            if (yaw < minYaw) minYaw = yaw; if (yaw > maxYaw) maxYaw = yaw;
            if (pitch < minPitch) minPitch = pitch; if (pitch > maxPitch) maxPitch = pitch;
            if (roll < minRoll) minRoll = roll; if (roll > maxRoll) maxRoll = roll;
        }

        dto.setRangeYaw(round(maxYaw - minYaw));
        dto.setRangePitch(round(maxPitch - minPitch));
        dto.setRangeRoll(round(maxRoll - minRoll));

        double mYaw = sumYaw / n, mPitch = sumPitch / n, mRoll = sumRoll / n;
        double vYaw = 0, vPitch = 0, vRoll = 0;
        for (Reading r : readings) {
            vYaw += Math.pow(r.getY() - mYaw, 2);
            vPitch += Math.pow(r.getP() - mPitch, 2);
            vRoll += Math.pow(r.getR() - mRoll, 2);
        }
        dto.setStdYaw(round(Math.sqrt(vYaw / n)));
        dto.setStdPitch(round(Math.sqrt(vPitch / n)));
        dto.setStdRoll(round(Math.sqrt(vRoll / n)));
    }

    private void computeTremorIndex(AnalysisDTO dto) {
        // tremorRms = sqrt(stdX² + stdY² + stdZ²)
        // Elimina la gravedad (componente estática) usando la desviación estándar.
        // La std mide solo la variación dinámica alrededor de la media de cada eje.
        double sx = dto.getStdX() != null ? dto.getStdX() : 0;
        double sy = dto.getStdY() != null ? dto.getStdY() : 0;
        double sz = dto.getStdZ() != null ? dto.getStdZ() : 0;
        double tremorRms = Math.sqrt(sx * sx + sy * sy + sz * sz);
        dto.setTremorRms(round(tremorRms));

        // Thresholds orientativos basados en amplitud dinámica (m/s²).
        // Requieren calibración clínica con este protocolo y ubicación de sensor específicos.
        //   < 0.10        → Normal   (index  0–25)
        //   0.10 – 0.50   → Leve     (index 26–50)
        //   0.50 – 1.00   → Moderado (index 51–75)
        //   > 1.00        → Severo   (index 76–100)
        double index;
        String severity;

        if (tremorRms < 0.10) {
            index = (tremorRms / 0.10) * 25;
            severity = "Normal";
        } else if (tremorRms < 0.50) {
            index = 25 + ((tremorRms - 0.10) / 0.40) * 25;
            severity = "Leve";
        } else if (tremorRms < 1.00) {
            index = 50 + ((tremorRms - 0.50) / 0.50) * 25;
            severity = "Moderado";
        } else {
            index = Math.min(100, 75 + ((tremorRms - 1.00) / 1.00) * 25);
            severity = "Severo";
        }

        dto.setTremorIndex(round(index));
        dto.setTremorSeverity(severity);
    }

    private double round(double v) {
        return Math.round(v * 1000.0) / 1000.0;
    }
}
