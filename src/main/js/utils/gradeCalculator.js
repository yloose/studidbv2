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

// Calculate weighted average
export function calculateWeightedAverage(modules) {
    if (!modules || modules.length === 0) return 0;

    const filteredModules = modules.filter(module => parseFloat(module.grade) !== 5.0);

    if (filteredModules.length === 0) return 0;

    const totalWeightedGrade = filteredModules.reduce((total, module) =>
        isGrundModule(module.moduleCode)
            ? total + (parseFloat(module.grade) * (parseInt(module.ects)) / 2)
            : total + (parseFloat(module.grade) * parseInt(module.ects)), 0);

    const totalCredits = filteredModules.reduce((total, module) =>
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