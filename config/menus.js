import {ApartmentOutlined, DeploymentUnitOutlined, HomeOutlined, UserOutlined} from "@ant-design/icons";

const rawMenus = [
    { key: 'index', title: '首页', path: '/', icon: <HomeOutlined /> },

    { key: 'network', title: '网络管理', icon: <DeploymentUnitOutlined /> },
    { key: 'network-list', parentKey: "network", title: '网络列表', path: '/network' },
    { key: 'network-description', parentKey: "network", title: '网络详情', path: '/network/[id]' },

    { key: 'user', title: '用户管理', icon: <UserOutlined /> },
    { key: 'user-list', parentKey: "user", title: '用户列表', path: '/user' },

    { key: 'channel', title: '通道管理', icon: <ApartmentOutlined /> },
    { key: 'channel-list', parentKey: "channel", title: '通道列表', path: '/channel' },

    { key: 'organization', title: '组织管理', icon: <ApartmentOutlined /> },
    { key: 'organization-list', parentKey: "organization", title: '组织列表', path: '/organization' },

    { key: 'chaincode', title: '链码管理', icon: <ApartmentOutlined /> },
    { key: 'chaincode-list', parentKey: "chaincode", title: '链码列表', path: '/chaincode' },
];

const getMenusWithChildren = (rawMenus) => {
    const menus = rawMenus.map(m => ({ children: [], ...m }));
    const items = menus.reduce((map, m) => {
        return { [m.key]: m, ...map };
    }, {});

    menus
        .filter(m => m?.parentKey)
        .forEach(m => items[m.parentKey].children.push(m));

    return [ menus, items ];
}

export const [ menus, menuMap ] = getMenusWithChildren(rawMenus);

export const getMenuKeysByPathname = (pathname) => {
    const keys = (menu) => {
        if (menu === undefined)
            return [];
        return [ menu.key, ...keys(menuMap[menu.parentKey]) ]
    }
    return keys(menus.find(m => m.path === pathname))
};

