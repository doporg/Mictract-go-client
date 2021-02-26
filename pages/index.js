import MenuLayout from "components/MenuLayout/MenuLayout";
import { Typography } from 'antd';

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
