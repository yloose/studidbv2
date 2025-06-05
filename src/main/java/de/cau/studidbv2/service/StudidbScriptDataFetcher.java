package de.cau.studidbv2.service;

import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Profile("!localDataFetcher")
public class StudidbScriptDataFetcher implements StudidbDataFetcher{

    @Value("${de.cau.studidbv2.dataScriptPath}")
    private static String dataScriptPath;

    private static final Logger LOG = LoggerFactory.getLogger(StudidbScriptDataFetcher.class);

    public StudidbDocuments fetchDocuments(String vpnUsername, String vpnPassword, String studidbUsername, String studidbPassword) throws LoginException {
        List<String> command = new ArrayList<>();
        command.add(dataScriptPath);
        command.add(vpnUsername);
        command.add(studidbUsername);

        ProcessBuilder processBuilder = new ProcessBuilder(command);

        Map<String, String> environment = processBuilder.environment();
        environment.put("VPN_PASSWORD", vpnPassword);
        environment.put("STUDIDB_PASSWORD", studidbPassword);

        try {
            Process process = processBuilder.start();
            List<String> outputLines;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                outputLines = reader.lines().toList();
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                // Capture error output
                String errorOutput;
                try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    errorOutput = errorReader.lines().collect(Collectors.joining("\n"));
                }
                throw new LoginException("Script exited with code " + exitCode + ": " + errorOutput);
            }

            if (outputLines.size() < 3) {
                throw new LoginException("Internal error.");
            }

            // Get last 3 lines
            List<String> filePaths = outputLines.subList(outputLines.size() - 3, outputLines.size());

            File startFile = new File(filePaths.get(0));
            File modulesFile = new File(filePaths.get(1));
            File examsFile = new File(filePaths.get(2));
            StudidbDocuments documents = new StudidbDocuments(
                    Jsoup.parse(examsFile, "UTF-8", STUDIDB_BASE_URL),
                    Jsoup.parse(startFile, "UTF-8", STUDIDB_BASE_URL),
                    Jsoup.parse(modulesFile, "UTF-8", STUDIDB_BASE_URL)
            );

            if (!startFile.delete() || !modulesFile.delete() || !examsFile.delete())
                LOG.warn("Failed to delete studidb document file");

            return documents;

        } catch (Exception e) {
            throw new RuntimeException("Failed to execute script", e);
        }
    }
}
