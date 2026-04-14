package org.example.parkinsontapweb.mapper;

import org.example.parkinsontapweb.dto.EvaluatedDTO;
import org.example.parkinsontapweb.dto.TestDTO;
import org.example.parkinsontapweb.entity.Evaluated;

import java.util.List;
import java.util.stream.Collectors;

public class EvaluatedMapper {

    public static EvaluatedDTO toDTO(Evaluated evaluated) {
        EvaluatedDTO dto = new EvaluatedDTO();
        dto.setId(evaluated.getId());
        dto.setName(evaluated.getName());
        dto.setWeight(evaluated.getWeight());
        dto.setHeight(evaluated.getHeight());
        dto.setBirthDate(evaluated.getBirthDate());
        dto.setNotes(evaluated.getNotes());
        dto.setStatus(evaluated.getStatus());

        if (evaluated.getGenre() != null)
            dto.setGenreName(evaluated.getGenre().getGenreName());

        if (evaluated.getEvaluatedType() != null)
            dto.setEvaluatedTypeName(evaluated.getEvaluatedType().getTypeName());

        //if (evaluated.getDoctor() != null)
        //    dto.setDoctorId(evaluated.getDoctor().getId());

        if (evaluated.getTests() != null) {
            List<TestDTO> testDTOs = evaluated.getTests().stream().map(test -> {
                TestDTO testDTO = new TestDTO();
                testDTO.setTestId(test.getId());
                testDTO.setName(test.getName());
                testDTO.setDateTime(test.getDateTime().toString());
                testDTO.setEvalAxis(test.getEvalAxis());
                testDTO.setDescription(test.getDescription());
                return testDTO;
            }).collect(Collectors.toList());

            dto.setTests(testDTOs);
        }

        return dto;
    }

    public static List<EvaluatedDTO> toDTOList(List<Evaluated> list) {
        return list.stream().map(EvaluatedMapper::toDTO).collect(Collectors.toList());
    }
}
