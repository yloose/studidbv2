package de.cau.studidbv2.service;

import de.cau.studidbv2.dto.ExamResult;
import de.cau.studidbv2.dto.StudidbUserInfo;
import de.cau.studidbv2.dto.UserSemester;
import de.cau.studidbv2.dto.Module;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class StudidbService {

    private final Logger LOG = LoggerFactory.getLogger(StudidbService.class);
    private static final String STUDIDB_BASE_URL = "https://studidb.informatik.uni-kiel.de:8484";

    public StudidbAuthorization login(String username, String password) throws LoginException {
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

        LOG.info(res.url().toString());
        LOG.info(res.url().getPath());
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

    private List<ExamResult> parseExamResults(Document doc) throws Exception {
        Element table = doc.selectFirst(".standard2");
        if (table == null)
            throw new Exception("Received unexpectedly formatted response");

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

    private StudidbUserInfo parseUserInfo(Document doc) throws Exception {
        Element table = doc.selectFirst("table.standard");
        if (table == null)
            throw new Exception("Received unexpectedly formatted response");

        Elements generalAttributes = table.select("p b");
        if (generalAttributes.size() < 3)
            throw new Exception("Received unexpectedly formatted response");
        String name = generalAttributes.get(0).text();
        String street = generalAttributes.get(1).text();
        String city = generalAttributes.get(2).text();

        String phone = table.select("input[name=telefon]").attr("value");

        Elements emailContainer = table.select("tr:has(td:contains(E-Mail))").select("td");
        if (emailContainer.size() < 2)
            throw new Exception("Received unexpectedly formatted response");
        String email = emailContainer.get(1).text();

        return new StudidbUserInfo(name, street + ", " + city, phone, email);
    }

    public UserSemester parseUserModule(Document doc) throws Exception {
        Element table = doc.selectFirst("table.standard");
        if (table == null)
            throw new Exception("Received unexpectedly formatted response");

        Element infoRow = doc.selectFirst("table.standard tr:nth-child(2) td");
        if (infoRow == null)
            throw new Exception("Received unexpectedly formatted response");

        String infoText = infoRow.text();
        // Example text: "Sie studieren zur Zeit Bachelor, 1-Fach Informatik im 6. Semester."

        // Extract the study major and semester using regular expressions
        String major = "";
        int semester = 0;

        // Extract study major
        if (infoText.contains("studieren") && infoText.contains("im")) {
            major = infoText.substring(infoText.indexOf("Zeit") + 5, infoText.indexOf("im")).trim();

            // Extract semester
            String semesterStr = infoText.substring(infoText.indexOf("im") + 3, infoText.indexOf("Semester")).trim();
            if (semesterStr.endsWith(".")) {
                semesterStr = semesterStr.substring(0, semesterStr.length() - 1);
            }
            try {
                semester = Integer.parseInt(semesterStr);
            } catch (NumberFormatException e) {
                LOG.error("Failed to parse semester: {}", semesterStr);
            }
        }

        // Parse enrolled modules
        List<Module> enrolledModules = parseEnrolledModules(doc);

        return new UserSemester(semester, major, enrolledModules);
    }

    private List<Module> parseEnrolledModules(Document doc) {
        List<Module> modules = new ArrayList<>();

        // Select the table containing enrolled modules
        Element enrolledTable = doc.selectFirst("table#angemeldet");
        if (enrolledTable == null) return modules;

        Elements rows = enrolledTable.select("tr");
        // Skip the header row
        for (int i = 1; i < rows.size() - 1; i++) { // Skip the last row which is just spacing
            Element row = rows.get(i);
            Elements cols = row.select("td");

            if (cols.size() >= 4) {
                String moduleId = cols.get(0).text();
                String moduleName = cols.get(1).text();
                String ectsText = cols.get(3).text().replace("ECTS", "").trim();

                int ects = 0;
                try {
                    ects = Integer.parseInt(ectsText);
                } catch (NumberFormatException e) {
                    LOG.error("Failed to parse ECTS: {}", ectsText);
                }

                modules.add(new Module(moduleId, moduleName, ects));
            }
        }

        return modules;
    }

    private Document getStudidbDocument(String path, String sessionId, String jsessionId) throws IOException {
        Connection.Response res = Jsoup.connect(STUDIDB_BASE_URL + path + "?session_id=" + sessionId)
                .userAgent("Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0")
                .header("Cache-Control", "no-cache")
                .header("Referer", STUDIDB_BASE_URL + "/studierende/start?session_id=" + sessionId)
                .cookie("JSESSIONID", jsessionId)
                .method(Connection.Method.GET)
                .execute();

        return res.parse();
    }

    public List<ExamResult> getExamResults(StudidbAuthorization authorization) throws Exception {
        Document doc = getStudidbDocument("/studierende/leistungen", authorization.sessionId(), authorization.jsessionId());
        return parseExamResults(doc);
    }

    public StudidbUserInfo getUserInfo(StudidbAuthorization authorization) throws Exception {
        Document doc = getStudidbDocument("/studierende/start", authorization.sessionId(), authorization.jsessionId());
        return parseUserInfo(doc);
    }

    public UserSemester getUserSemester(StudidbAuthorization authorization) throws Exception {
        Document doc = getStudidbDocument("/studierende/module", authorization.sessionId(), authorization.jsessionId());
        return parseUserModule(doc);
    }
}
