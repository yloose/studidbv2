package de.cau.studidbv2.dto;

import java.util.Date;
import java.util.List;

public record DataResponse(
        List<ExamResult> examResults,
        Date fetchDate
) {
    public DataResponse(List<ExamResult> examResults) {
        this(examResults, new Date());
    }
}
