import moment from "moment";
import {message} from "antd";

export const interactWithMessage = (reqPromiseFn) => {
    return async () => {
        const key = moment().valueOf();
        message.loading({content: 'loading', key});

        try {
            await reqPromiseFn();
            message.success({content: 'success', key});
        } catch (e) {
            message.error({content: `error: ${e}`, key});
        }
    }
}
