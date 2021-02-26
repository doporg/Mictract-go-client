import style from "./MenuSider.less";
import { Layout, Menu } from "antd";
import Link from "next/link";
import {useRouter} from "next/router";
import {getMenuKeysByPathname} from "config/menus";

const { SubMenu } = Menu;
const { Sider, Header } = Layout;

const renderSubMenu = ({ key, title, icon, children }) => {
    return (
        <SubMenu key={key} icon={icon} title={title}>
            { children.map(renderMenus) }
        </SubMenu>
    );
}

const renderMenuItem = ({ key, icon, path, title }) => {
    return (
        <Menu.Item key={key}>
            { icon }
            <Link href={path}>{title}</Link>
        </Menu.Item>
    );
}

const renderMenus = (menu) => {
    if (menu.children.length === 0) {
        return renderMenuItem(menu)
    } else {
        return renderSubMenu(menu);
    }
};

const MenuSider = ({ menus }) => {
    // TODO: extract style
    const router = useRouter();
    const [ selectedKey, ...openKeys ] = getMenuKeysByPathname(router.pathname)

    return (
        <Sider width={200}>
            <div style={{display:'flex', flexFlow:'column', height:'100%'}}>
                <Header className="header" >
                    <p className={style.appName}>Mictract</p>
                </Header>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[selectedKey]}
                        defaultOpenKeys={openKeys}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        {
                            menus
                                .filter(m => m.parentKey === undefined)
                                .map(renderMenus)
                        }
                    </Menu>
            </div>
        </Sider>
    );
}

export default MenuSider;
