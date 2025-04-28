// Lookup data structure for calculation weighted avg
const GRUND_MODULES = new Set([
    "Inf-CompSys",
    "Inf-Math-A",
    "Inf-Math-B",
    "infCN-01a",
    "infEAlg-01a",
    "infEInf-01a",
    "infProgOO-01a",
    "infEWInf-01a"
]);

export function isGrundModule(moduleCode) {
    return GRUND_MODULES.has(moduleCode);
}

export function removeWorstECTS(modules, semester) {
    // Return original modules if semester > 6
    if (parseInt(semester) > 6) {
        return [...modules];
    }

    // Filter out failed modules (grade 5.0) and create a copy
    const passingModules = modules
        .filter(module => parseFloat(module.grade) !== 5.0)
        .map(module => ({...module}));

    // Sort modules by grade (worst to best)
    // If grades are equal, sort by ECTS (higher ECTS first)
    passingModules.sort(function(a, b) {
        const gradeA = parseFloat(a.grade);
        const gradeB = parseFloat(b.grade);

        if (gradeB > gradeA) {
            return 1;
        } else if (gradeB < gradeA) {
            return -1;
        } else {
            // grades are equal, sort by ECTS (higher ECTS first)
            const ectsA = parseFloat(a.ects);
            const ectsB = parseFloat(b.ects);

            if (ectsA > ectsB) {
                return -1;
            } else if (ectsA < ectsB) {
                return 1;
            } else {
                return 0;
            }
        }
    });

    // FPO says 18 ECTS are removed
    let remainingECTSToRemove = 18;
    let i = 0;

    while (remainingECTSToRemove > 0 && i < passingModules.length) {
        const module = passingModules[i];
        const moduleECTS = parseFloat(module.ects);

        // We can remove ECTS
        if (remainingECTSToRemove >= moduleECTS) {
            // Remove this module entirely
            passingModules.splice(i, 1);
            remainingECTSToRemove -= moduleECTS;
        } else {
            // Partially remove this module's ECTS
            module.ects = (moduleECTS - remainingECTSToRemove).toString();
            remainingECTSToRemove = 0;
            i++;
        }
    }

    return passingModules;
}

// Calculate weighted average
export function calculateWeightedAverage(modules, semester = null) {
    if (!modules || modules.length === 0) return 0;

    const filteredModules = modules.filter(module => parseFloat(module.grade) !== 5.0);
    const removedModules = removeWorstECTS(filteredModules, semester);

    if (removedModules.length === 0) return 0;

    const totalWeightedGrade = removedModules.reduce((total, module) =>
        isGrundModule(module.moduleCode)
            ? total + (parseFloat(module.grade) * (parseInt(module.ects)) / 2)
            : total + (parseFloat(module.grade) * parseInt(module.ects)), 0);

    const totalCredits = removedModules.reduce((total, module) =>
        total + parseFloat(module.ects), 0);

    return (totalWeightedGrade / totalCredits).toFixed(2);
}

// Calculate simple average
export function calculateSimpleAverage(modules) {
    if (!modules || modules.length === 0) return 0;

    const filteredModules = modules.filter(module => parseFloat(module.grade) !== 5.0);

    if (filteredModules.length === 0) return 0;

    const sum = filteredModules.reduce((total, module) => total + parseFloat(module.grade), 0);
    return (sum / filteredModules.length).toFixed(2);
}

// Calculate total ECTS
export function calculateTotalECTS(modules) {
    if (!modules || modules.length === 0) return 0;

    const filteredModules = modules.filter(module => parseFloat(module.grade) !== 5.0);

    return filteredModules.reduce((total, module) => total + parseFloat(module.ects), 0);
}