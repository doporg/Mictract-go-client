import MenuLayout from "components/MenuLayout/MenuLayout";
import {message, Typography} from 'antd';
import moment from "moment";

const { Title } = Typography;

export default function Index() {
    return (
        <MenuLayout ribbon={"WIP"}>
            <div style={{textAlign: 'center'}}>
                <Title>Index Page</Title>
            </div>
        </MenuLayout>
    );
}

export const interactWithMessage = (reqPromiseFn) => {
    return async () => {
        const key = moment().valueOf();
        message.loading({content: 'loading', key});

        try {
            await reqPromiseFn();
            message.success({content: 'success', key});
        } catch (e) {
            message.error({content: `error: ${e.response.data.message}`, key});
        }
    }
}
