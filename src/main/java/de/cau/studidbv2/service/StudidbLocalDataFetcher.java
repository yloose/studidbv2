package de.cau.studidbv2.service;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Profile("localDataFetcher")
public class StudidbLocalDataFetcher implements StudidbDataFetcher {
    private StudidbAuthorization login(String username, String password) throws LoginException {
        Connection.Response res;
        try {
            res = Jsoup.connect(STUDIDB_BASE_URL + "/studierende/login")
                    .userAgent("Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0")
                    .header("Cache-Control", "no-cache")
                    .data("username", username, "password", password, "login", "Login")
                    .method(Connection.Method.POST)
                    .execute();
        } catch (Exception e){
            throw new LoginException(e.getMessage());
        }

        if (res.url().getPath().equals("/studierende/login")) {
            throw new LoginException("Wrong credentials.");
        }

        if (res.url().toString().split("=").length < 2)
            throw new LoginException("Received unexpected response from server");

        String sessionId = res.url().toString().split("=")[1];
        String jsessionId = res.cookies().get("JSESSIONID");

        if (jsessionId == null)
            throw new LoginException("Received unexpected response from server");

        return new StudidbAuthorization(sessionId, jsessionId);
    }

    private Document getStudidbDocument(String path, StudidbAuthorization authorization) throws IOException {
        Connection.Response res = Jsoup.connect(STUDIDB_BASE_URL + path + "?session_id=" + authorization.sessionId)
                .userAgent("Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0")
                .header("Cache-Control", "no-cache")
                .header("Referer", STUDIDB_BASE_URL + "/studierende/start?session_id=" + authorization.sessionId)
                .cookie("JSESSIONID", authorization.jsessionId)
                .method(Connection.Method.GET)
                .execute();

        return res.parse();
    }

    public StudidbDocuments fetchDocuments(String vpnUsername, String vpnPassword, String studidbUsername, String studidbPassword) throws LoginException {
        StudidbAuthorization auth = login(studidbUsername, studidbPassword);
        try {
            return new StudidbDocuments(
                    getStudidbDocument("/studierende/leistungen", auth),
                    getStudidbDocument("/studierende/start", auth),
                    getStudidbDocument("/studierende/module", auth)
            );
        } catch (IOException e) {
            throw new LoginException("Failed to get data from studidb server.");
        }
    }

    private record StudidbAuthorization(
            String sessionId,
            String jsessionId
    ) { }
}
