package de.cau.studidbv2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RootController {

    @ResponseBody
    @RequestMapping("/")
    public String index() {
        return "Hello World!";
    }
}
