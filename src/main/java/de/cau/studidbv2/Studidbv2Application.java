package de.cau.studidbv2;

import de.cau.studidbv2.service.StudidbService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Studidbv2Application {

    public static void main(String[] args) {
		SpringApplication.run(Studidbv2Application.class, args);
	}
}
