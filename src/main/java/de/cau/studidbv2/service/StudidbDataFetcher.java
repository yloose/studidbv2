package de.cau.studidbv2.service;

import org.jsoup.nodes.Document;

public interface StudidbDataFetcher {
    String STUDIDB_BASE_URL = "https://studidb.informatik.uni-kiel.de:8484";

    StudidbDocuments fetchDocuments(String vpnUsername, String vpnPassword, String studidbUsername, String studidbPassword) throws LoginException;

    record StudidbDocuments(
      Document examResults,
      Document userInfo,
      Document userSemester
    ) { }
}
