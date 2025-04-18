package de.cau.studidbv2.dto;


import java.util.Date;
import java.util.List;

public record DataResponse(
        List<ExamResult> examResults,
        StudidbUserInfo userInfo,
        UserSemester userSemester,
        Date fetchDate
) {
    public DataResponse(List<ExamResult> examResults, StudidbUserInfo userInfo, UserSemester userSemester) {
        this(examResults, userInfo, userSemester, new Date());
    }
}
