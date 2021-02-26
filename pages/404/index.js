import Link from 'next/link'
import MenuLayout from "components/MenuLayout/MenuLayout";
import { Typography } from 'antd';

const { Title } = Typography;

export default function FourOhFour() {
    return (
        <MenuLayout>
            <div style={{textAlign: 'center'}}>
                <Title>Oops! </Title>
                <Title level={4}>Page Not Found</Title>
                <Link href="/"><a>Go back home</a></Link>
            </div>
        </MenuLayout>
    );
}
