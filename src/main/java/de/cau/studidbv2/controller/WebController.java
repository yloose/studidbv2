package de.cau.studidbv2.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@Controller
public class WebController {
    @GetMapping(path={"/", "/buildings/**", "/routes", "/login", "/users", "/jobs"})
    public String index() {
        return "forward:/index.html";
    }
}