import React from "react";
import {Card, ConfigProvider, Layout, Badge} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { menus } from 'config/menus';

import MenuSider from "components/MenuSider/MenuSider";
import MenuHeader from "components/MenuHeader/MenuHeader";
import ContentLoader from "components/ContentLoader/ContentLoader";
import { Scrollbars } from 'react-custom-scrollbars';
import style from './MenuLayout.less';

const MenuLayout = ({ ribbon, children }) => {
    const content = (
        <Card className={style.layoutCard}>
            <ContentLoader>{ children }</ContentLoader>
        </Card>
    );

    return (
        <Layout>
            <ConfigProvider locale={zhCN}>
                <MenuSider menus={menus} />
                <Layout>
                    <MenuHeader />
                    <Scrollbars
                        autoHide
                        universal
                        renderTrackHorizontal={ props =>
                            <div className={["track-horizontal", style.horizontalScrollbar]} {...props} />
                        }
                        renderThumbHorizontal={ props =>
                            <div className={["thumb-horizontal", style.horizontalScrollbar]} {...props} />
                        }
                    >
                        <Layout id={"content-holder"} className={style.contentHolder}>
                            <Layout.Content className={style.layoutContent}>
                                {
                                    ribbon ?
                                        <Badge.Ribbon text={ribbon}> {content} </Badge.Ribbon> :
                                        content
                                }
                            </Layout.Content>
                        </Layout>
                        <Layout.Footer className={style.layoutFooter}>
                            2021 Created by <a href={"https://github.com/TangliziGit"}>Tanglizi</a>
                        </Layout.Footer>
                    </Scrollbars>
                </Layout>
            </ConfigProvider>
        </Layout>
    );
}

export default MenuLayout;
