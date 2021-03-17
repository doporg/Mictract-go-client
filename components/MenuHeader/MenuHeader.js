import {Breadcrumb, Layout} from "antd";
import style from './MenuHeader.less';
import {getMenuKeysByPathname, menuMap} from "config/menus";
import * as R from 'ramda';
import {useRouter} from "next/router";
import {EnvironmentOutlined} from "@ant-design/icons";

const { Header } = Layout;

const MenuHeader = () => {
    const router = useRouter();
    const menuKeys = getMenuKeysByPathname(router.pathname)

    const handle = R.pipe(
        R.reverse(),
        R.map(key => {
            return <Breadcrumb.Item key={key}> { menuMap[key].title } </Breadcrumb.Item>
        })
    );

    return (
        <Header className={["header", style.header]}>
            <EnvironmentOutlined style={{color: 'white', margin: 'auto 10px auto 0'}}/>
            <Breadcrumb className={style.breadcrumb} separator=">">
                {
                    handle(menuKeys)
                }
            </Breadcrumb>
        </Header>
    );
}

export default MenuHeader;
