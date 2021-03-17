import {useEffect, useState} from 'react';
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
    let active = true;
    const [ loading, setLoading ] = useState(false);
    const [ failed, setFailed ] = useState(false);

    useEffect(() => {
        return () => active = false;
    });

    Router.events.on('routeChangeStart', () => {
        NProgress.start();
        if (active) {
            setLoading(true);
        }
    })
    Router.events.on('routeChangeError', () => {
        NProgress.done();
        setFailed(true)
    })
    Router.events.on('routeChangeComplete', () => {
        NProgress.done();
        if (active) {
            setLoading(false);
            setFailed(false);
        }
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
