package de.cau.studidbv2.controller;

import de.cau.studidbv2.dto.DataResponse;
import de.cau.studidbv2.dto.ExamResult;
import de.cau.studidbv2.service.LoginException;
import de.cau.studidbv2.service.StudidbAuthorization;
import de.cau.studidbv2.service.StudidbService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final StudidbService studidbService;

    public ApiController(StudidbService studidbService) {
        this.studidbService = studidbService;
    }

    private String[] getCredentials(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Basic "))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid credentials");

        String credentialsString = new String(Base64.getDecoder().decode(authHeader.substring("Basic ".length())));
        String[] credentials = credentialsString.split(":");
        if (credentials.length != 2)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid credentials");

        return credentials;
    }

    @GetMapping("/data")
    public DataResponse getData(@RequestHeader(value = "Authorization") String authHeader) {
        String[] credentials = getCredentials(authHeader);

        try {
            StudidbAuthorization authorization = studidbService.login(credentials[0], credentials[1]);
            List<ExamResult> examResults = studidbService.getExamResults(authorization);
            return new DataResponse(examResults);
        } catch (LoginException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error");
        }
    }
}
