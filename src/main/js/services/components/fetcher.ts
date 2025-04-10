import axios from "axios";

let token = localStorage.getItem("token")
if (token != null )
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// @ts-ignore
const getFetcher = (transform?: Function) => ((...args: Parameters<typeof fetch>) => axios.get(...args).then(data => transform?.(data) || data.data))

export default getFetcher;