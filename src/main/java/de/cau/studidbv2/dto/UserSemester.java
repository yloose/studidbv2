package de.cau.studidbv2.dto;

import java.util.List;

public record UserSemester (
    int semester,
    String major,
    List<Module> enrolledModules
) {}


