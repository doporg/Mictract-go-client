import axios from "axios";

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

export default function Api(path, options = {}) {
    let params = {};
    let data = {};

    const call = () => axios.get(path, { params, data, ...options });
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
