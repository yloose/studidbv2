package de.cau.studidbv2.service;

import de.cau.studidbv2.dto.*;
import de.cau.studidbv2.dto.Module;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class StudidbService {

    private final Logger LOG = LoggerFactory.getLogger(StudidbService.class);
    private final StudidbDataFetcher studidbDataFetcher;

    public StudidbService(StudidbDataFetcher studidbDataFetcher) {
        this.studidbDataFetcher = studidbDataFetcher;
    }

    public DataResponse getStudidbData(String vpnUsername, String vpnPassword, String studidbUsername, String studidbPassword) throws LoginException {
        StudidbDataFetcher.StudidbDocuments documents = studidbDataFetcher.fetchDocuments(vpnUsername, vpnPassword, studidbUsername, studidbPassword);
        try {
            return new DataResponse(
                    parseExamResults(documents.examResults()),
                    parseUserInfo(documents.userInfo()),
                    parseUserModule(documents.userSemester())
            );
        } catch (Exception e) {
            throw new LoginException("Failed to parse response from studidb server: " + e.getMessage());
        }
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
        String major = "";
        int semester = 0;

        if (infoText.contains("studieren") && infoText.contains("im")) {
            major = infoText.substring(infoText.indexOf("Zeit") + 5, infoText.indexOf("im")).trim();
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

        List<Module> enrolledModules = parseEnrolledModules(doc);

        return new UserSemester(semester, major, enrolledModules);
    }

    private List<Module> parseEnrolledModules(Document doc) {
        List<Module> modules = new ArrayList<>();

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
}
