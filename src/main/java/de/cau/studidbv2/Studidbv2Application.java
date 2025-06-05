package de.cau.studidbv2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Path;

@SpringBootApplication
public class Studidbv2Application {

	private static final Logger LOG = LoggerFactory.getLogger(Studidbv2Application.class);

    public static void main(String[] args) {
		SpringApplication app = new SpringApplication(Studidbv2Application.class);
		if (Files.notExists(Path.of("/usr/local/bin/studidbData.sh"))) {
			LOG.info("Studidb data retrieval script not found. Falling back to local fetching.");
			app.setAdditionalProfiles("localDataFetcher");
		}
		app.run(args);
	}
}
