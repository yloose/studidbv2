// Theoretische Informatik, Maschine Learning, Software Engineering, Nebenfach, Mathematik, Praktische Informatik, Sonstiges


// Hashmap for module mapping
const moduleToCategory = {
    // Grundmodule (BSc-Inf-G)
    "Inf-CompSys": "Praktische Informatik",
    "Inf-Math-A": "Mathematik",
    "Inf-Math-B": "Mathematik",
    "infCN-01a": "Praktische Informatik",
    "infEAlg-01a": "Theoretische Informatik",
    "infEInf-01a": "Theoretische Informatik",
    "infProgOO-01a": "Software Engineering",

    // Aufbaumodule (BSc-Inf-A)
    "Inf-Math-C": "Mathematik",
    "Inf-SP": "Software Engineering",
    "infAAK-01a": "Theoretische Informatik",
    "infAAK_A-01a": "Theoretische Informatik",
    "infAAK_K-01a": "Theoretische Informatik",
    "infBL-01a": "Theoretische Informatik",
    "infBL_B-01a": "Theoretische Informatik",
    "infBL_L-01a": "Theoretische Informatik",
    "infDB-01a": "Praktische Informatik",
    "infDP-01a": "Praktische Informatik",
    "infDSProj-01a": "Machine Learning",
    "infDaSci-01a": "Machine Learning",
    "infEthik-01a": "Theoretische Informatik",
    "infOS-01a": "Praktische Informatik",
    "infST-01a": "Software Engineering",

    // Wahlpflichtmodule Informatik (BSc-Inf-WP)
    "Inf-AlgSeq": "Theoretische Informatik",
    "Inf-BioInf-SysBio": "Sonstiges",
    "Inf-CB": "Praktische Informatik",
    "Inf-CG": "Praktische Informatik",
    "Inf-CombWords": "Theoretische Informatik",
    "Inf-DPS": "Praktische Informatik",
    "Inf-DatSchutz": "Sonstiges",
    "Inf-DigSig": "Praktische Informatik",
    "Inf-EinfBV": "Praktische Informatik",
    "Inf-EntEinSys": "Praktische Informatik",
    "Inf-GSoZu": "Software Engineering",
    "Inf-GraphDraw8": "Praktische Informatik",
    "Inf-HPC": "Praktische Informatik",
    "Inf-ITSec5": "Praktische Informatik",
    "Inf-InfRecht": "Nebenfach",
    "Inf-MKli": "Nebenfach",
    "Inf-NNDL": "Machine Learning",
    "Inf-NVP": "Praktische Informatik",
    "Inf-NumProg": "Mathematik",
    "Inf-PP": "Software Engineering",
    "Inf-PPS": "Praktische Informatik",
    "Inf-PatRec": "Machine Learning",
    "Inf-SyncSpr": "Praktische Informatik",
    "MS0101": "Theoretische Informatik",
    "MS0201": "Theoretische Informatik",
    "MS0202": "Theoretische Informatik",
    "MS0304": "Praktische Informatik",
    "infAlgMetP-01a": "Praktische Informatik",
    "infAuLearn-01a": "Machine Learning",
    "infBDMaA-01a": "Mashine Learning",
    "infBRPA-01a": "Praktische Informatik",
    "infCB-01a": "Praktische Informatik",
    "infCDP-01a": "Praktische Informatik",
    "infCG-01a": "Praktische Informatik",
    "infCG-02a": "Praktische Informatik",
    "infCI-01a": "Machine Learning",
    "infCryp-01a": "Theoretische Informatik",
    "infDO-01a": "Theoretische Informatik",
    "infDS-01a": "Praktische Informatik",
    "infDSS-01a": "Praktische Informatik",
    "infDataVis-01a": "Machine Learning",
    "infEAeS-01a": "Praktische Informatik",
    "infEDAI-01a": "Machine Learning",
    "infEOR-01a": "Theoretische Informatik",
    "infESSS-02a": "Software Engineering",
    "infEdP-02a": "Software Engineering",
    "infEnlOpt-01a": "Mathematik",
    "infFGA-01a": "Theoretische Informatik",
    "infFP-01a": "Praktische Informatik",
    "infGIS-01a": "Praktische Informatik",
    "infIO-01a": "Mathematik",
    "infIR-01a": "Praktische Informatik",
    "infInS-01a": "Machine Learning",
    "infIoT-01a": "Praktische Informatik",
    "infKDDM-01a": "Machine Learning",
    "infKuK-01a": "Machine Learning",
    "infLICS2-01a": "Theoretische Informatik",
    "infMAES-01a": "Praktische Informatik",
    "infMobRob-01a": "Praktische Informatik",
    "infNumSim-01a": "Praktische Informatik",
    "infODS-01a": "Machine Learning",
    "infOdS-01a": "Mathematik",
    "infPM-01a": "Praktische Informatik",
    "infPaS-01a": "Praktische Informatik",
    "infPiNN-01a": "Machine Learning",
    "infProRo-01a": "Machine Learning",
    "infSA-01a": "Software Engineering",
    "infSEPVS-01a": "Software Engineering",
    "infSPAC-01a": "Theoretische Informatik",
    "infTM-01a": "Machine Learning",
    "infWmWt-01a": "Praktische Informatik",
    "infWortkomb-01a": "Theoretische Informatik",

    // Bachelorseminar (BSc-Inf-Sem)
    "Inf-Sem-AlgKom": "Theoretische Informatik",
    "Inf-Sem-Echtz": "Praktische Informatik",
    "Inf-Sem-FSV": "Software Engineering",
    "inf-wissASem": "Praktische Informatik",
    "infBSemAutoUFo-01a": "Theoretische Informatik",
    "infBSemDHI-01a": "Nebenfach",
    "infBSemDS-01a": "Machine Learning",
    "infBSemEIK-01a": "Nebenfach",
    "infBSemIMG-02a": "Nebenfach",
    "infBSemIS-01a": "Praktische Informatik",
    "infBSemNS-01a": "Praktische Informatik",
    "infBSemPS-01a": "Praktische Informatik",
    "infBSemSE-01a": "Software Engineering",
    "infBSemSafeML-02a": "Machine Learning",
    "infBSemVerAlg-01a": "Theoretische Informatik",
    "infBSemZsnN-01a": "Machine Learning",

    // Nebenfach (Bsc-NF)
    "BWL-ER": "Nebenfach",
    "BWL-EinfBWL": "Nebenfach",
    "VWL-EVWL": "Nebenfach",
    "VWLvwlMakro1-01a": "Nebenfach",
    "VWLvwlMakro2-01a": "Nebenfach",
    "VWLvwlMikro1-01a": "Nebenfach",
    "VWLvwlMikro2-01a": "Nebenfach"
};

export function getCategoryForModule(moduleCode) {
    if (moduleCode === "") {
        return "Nebenfach"
    }
    return moduleToCategory[moduleCode] || "Unbekannt";
}

// Module nach Kategorie filtern
export function getModulesByCategory(categoryName) {
    const result = [];

    for (const [moduleCode, category] of Object.entries(moduleToCategory)) {
        if (category === categoryName) {
            result.push(moduleCode);
        }
    }
    return result;
}