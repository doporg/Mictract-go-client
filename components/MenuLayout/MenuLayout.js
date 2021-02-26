import React from "react";
import {Card, ConfigProvider, Layout, Badge} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { menus } from 'config/menus';

import MenuSider from "components/MenuSider/MenuSider";
import MenuHeader from "components/MenuHeader/MenuHeader";
import ContentLoader from "components/ContentLoader/ContentLoader";
import { Scrollbars } from 'react-custom-scrollbars';

const MenuLayout = ({ ribbon, children }) => {
    // TODO: extract style
    return (
        <Layout>
            <ConfigProvider locale={zhCN}>
                <MenuSider menus={menus} />
                <Layout>
                    <MenuHeader />
                    <Scrollbars
                        autoHide
                    >
                        <Layout id={"content-holder"} style={{ padding: '0 24px' }}>
                            <Layout.Content style={{ marginTop: '20px' }}>
                                {
                                    ribbon ?
                                        <Badge.Ribbon text={ribbon}><Card><ContentLoader>{ children }</ContentLoader></Card></Badge.Ribbon> :
                                        <Card><ContentLoader>{ children }</ContentLoader></Card>
                                }
                            </Layout.Content>
                        </Layout>
                        <Layout.Footer style={{ textAlign: 'center' }}>
                            2021 Created by <a href={"https://github.com/TangliziGit"}>Tanglizi</a>
                        </Layout.Footer>
                    </Scrollbars>
                </Layout>
            </ConfigProvider>
        </Layout>
    );
}

export default MenuLayout;
