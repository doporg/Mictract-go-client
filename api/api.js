import axios from "axios";

export default function Api(method, path, options = {}) {
    const url = path;
    let params = {};
    let data = {};

    const call = () => axios({ method, url, params, data, ...options });
    const builder = Object.assign({ done: call }, {
        query: ps => {
            params = ps;
            return builder;
        },
        body: ds => {
            data = ds;
            return builder;
        },
    });

    return builder;
}
