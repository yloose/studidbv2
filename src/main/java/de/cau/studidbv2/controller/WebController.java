package de.cau.studidbv2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping(path={"/", "/login"})
    public String index() {
        return "forward:/index.html";
    }
}