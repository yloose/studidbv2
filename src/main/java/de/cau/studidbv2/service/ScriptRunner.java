package de.cau.studidbv2.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class ScriptRunner {

    public List<String> runScriptAndReadFiles(String scriptPath, String username, String password) throws Exception {
        List<String> fileContents = new ArrayList<>();

        // Run the bash script
        ProcessBuilder processBuilder = new ProcessBuilder(scriptPath);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Read the output (i.e., file paths)
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String filePath;
            while ((filePath = reader.readLine()) != null) {
                // Read the content of each file
                String content = Files.readString(Paths.get(filePath));
                fileContents.add(content);
            }
        }

        // Wait for the process to finish
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Script exited with code " + exitCode);
        }

        return fileContents;
    }
}
