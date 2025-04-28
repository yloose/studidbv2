

export const sortBySemester = (arr: any[], f: Function, direction = "asc") => {
    const parseSemester = (s: string) => (s.startsWith("WS") ? 0.5 : 0) + parseInt(s.match(/\d{2}/)[0] || "0");
    arr.sort((a, b) => (direction == "asc" ? 1 : -1) * (parseSemester(f(a)) - parseSemester(f(b))));
    return arr;
}