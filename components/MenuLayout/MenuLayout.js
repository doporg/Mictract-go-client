import React, {useEffect} from "react";
import {Card, ConfigProvider, Layout, Badge, message, notification} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { menus } from 'config/menus';

import MenuSider from "components/MenuSider/MenuSider";
import MenuHeader from "components/MenuHeader/MenuHeader";
import ContentLoader from "components/ContentLoader/ContentLoader";
import { Scrollbars } from 'react-custom-scrollbars';
import style from './MenuLayout.less';
import Head from "next/head";
import moment from "moment";

export const refreshDataSource = async (dataSourceAsync, setDataSource) => {
    try {
        const { data: { payload: dataSource } } = await dataSourceAsync();
        setDataSource(dataSource);
    } catch (e) {
        handleErrorWithMessage(e, {
            message: 'refreshing',
        });
    }
};

export const handleErrorWithMessage = (error, option = {
    message: '',
    key: undefined
}) => {
    const content = option.message || 'error';
    if (error.isAxiosError === undefined || !error.isAxiosError) {
        message.error({
            content: `${content}: ${error}`,
            key: option.key
        });
    } else {
        if (error?.response?.data === undefined) {
            message.error({
                content: `${content}: ${error}`,
                key: option.key
            });
        } else {
            message.destroy(option.key);

            const description = (
                <>
                    <strong>{content}</strong> &nbsp;
                    <span>{error.response.data?.message ?? 'server internal error'}</span>
                </>
            );

            notification.error({
                message: error.message,
                description,
            });
        }
    }
}

export const interactWithMessage = (reqPromiseFn, _message = 'request') => {
    return async () => {
        const key = moment().valueOf();
        message.loading({content: '加载中', key});

        try {
            await reqPromiseFn();
            message.success({content: '成功', key});
        } catch (error) {
            handleErrorWithMessage(error, {
                message: _message,
                key
            });
        }
    }
}

const MenuLayout = ({ ribbon, children }) => {
    const content = (
        <Card className={style.layoutCard}>
            <ContentLoader>{ children }</ContentLoader>
        </Card>
    );

    // useEffect(() => {
    //     axios.interceptors.response.use(
    //         response => response,
    //         error => {
    //             // do some error handling here
    //             return Promise.reject(error);
    //         }
    //     );
    // }, []);

    return (
        <>
            <Head>
                <title>Mictract</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Layout>
                <ConfigProvider locale={zhCN}>
                    <MenuSider menus={menus} />
                    <Layout>
                        <MenuHeader />
                        <Scrollbars
                            id={'content-holder'}
                            autoHide
                            universal
                            renderTrackHorizontal={ props =>
                                <div className={["track-horizontal", style.horizontalScrollbar]} {...props} />
                            }
                            renderThumbHorizontal={ props =>
                                <div className={["thumb-horizontal", style.horizontalScrollbar]} {...props} />
                            }
                        >
                            <Layout className={style.contentHolder}>
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
        </>
    );
}

export default MenuLayout;
