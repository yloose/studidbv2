package de.cau.studidbv2.service;

import de.cau.studidbv2.dto.ExamResult;
import jakarta.annotation.PostConstruct;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class StudidbService {

    private final Logger LOG = LoggerFactory.getLogger(StudidbService.class);

    @Value("${de.cau.studidbv2.username}")
    private String username;
    @Value("${de.cau.studidbv2.password}")
    private String password;

    @PostConstruct
    public void run() {
        try {
            // this.performRequest(username, password);
            //Document file = getExamResultsDocument(username, password);
            //LOG.info(Arrays.toString(parseResults(file).toArray()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<ExamResult> parseResults(Document doc) {
        Element table = doc.selectFirst(".standard2");
        Elements rows = table.select("tr");
        return IntStream.range(2, rows.size())
                .mapToObj(rows::get)
                .map(row -> {
                            Elements cols = row.select("td");
                            return new ExamResult(
                                    cols.get(0).text(),
                                    cols.get(1).text(),
                                    cols.get(2).text(),
                                    cols.get(3).text(),
                                    cols.get(4).text(),
                                    cols.get(5).text()
                            );
                        }
                ).collect(Collectors.toList());
    }

    public Document getExamResultsDocument(final String username, final String password) throws IOException {

        Connection session = Jsoup.newSession();

        Connection.Response res = session.url("https://studidb.informatik.uni-kiel.de:8484/studierende/login")
                .userAgent("Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0")
                .header("Cache-Control", "no-cache")
                .data("username", username, "password", password, "login", "Login")
                .method(Connection.Method.POST)
                .execute();

        String sessionId = res.url().toString().split("=")[1];

        Connection.Response res2 = session.url("https://studidb.informatik.uni-kiel.de:8484/studierende/leistungen?session_id=" + sessionId)
                .userAgent("Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0")
                .header("Cache-Control", "no-cache")
                .header("Referer", "https://studidb.informatik.uni-kiel.de:8484/studierende/start?session_id=" + sessionId)
                .cookie("JSESSIONID", res.cookies().get("JSESSIONID"))
                .method(Connection.Method.GET)
                .execute();

        Document page = res2.parse();
        return page;
    }
}
