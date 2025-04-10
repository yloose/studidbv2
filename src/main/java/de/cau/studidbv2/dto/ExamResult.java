package de.cau.studidbv2.dto;

public record ExamResult(
        String semester,
        String moduleCode,
        String moduleName,
        String grade,
        String ects,
        String lecturer
) {
}
