import { useState } from 'react';
import {Router} from "next/router";
import {Spin} from "antd";
import style from './ContentLoader.less';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const renderLoading = () => {
    return (
        <div className={style.loaderWrapper}>
            <Spin tip={"loading..."} className={style.spin}/>
        </div>
    )
};

const renderFailed = () => {
    return (
        <div className={style.loaderWrapper}>
            <h1>Oops!</h1>
            <h2>Error occurred.</h2>
        </div>
    );
}

const ContentLoader = ({ children }) => {
    const [ loading, setLoading ] = useState(false);
    const [ failed, setFailed ] = useState(false);

    Router.events.on('routeChangeStart', () => {
        NProgress.start();
        setLoading(true);
    })
    Router.events.on('routeChangeError', () => {
        NProgress.done();
        setFailed(true)
    })
    Router.events.on('routeChangeComplete', () => {
        NProgress.done();
        setLoading(false);
        setFailed(false);
    })

    return (
        <>
            {
                loading ? renderLoading() :
                    failed ? renderFailed() :
                        children
            }
        </>
    )
};

export default ContentLoader;
