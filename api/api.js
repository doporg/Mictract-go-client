import axios from "axios";

// TODO: handle error
axios.interceptors.response.use(
    response => response,
    error => {
        console.log(error);
        const { status } = error.response;
        switch (true) {
            case 500 <= status && status < 600:
                console.log("Server internal error occurred.");
                break;

            case 400 <= status && status < 500:
                console.log("Client requests error occurred.");
                break;

            default:
                console.log("Unkown error occurred.");
                break;
        }
    }
);

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
