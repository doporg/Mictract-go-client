import {Tooltip} from "antd";
import {SyncOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";

const REFRESH_INTERVAL = 30 * 1000;

const RefreshTimer = ({
                          interval = REFRESH_INTERVAL,
                          refreshAsync
                      }) => {
    const [ refreshing, setRefreshing ] = useState(false);
    const [ sinceRefreshTimer, setSinceRefreshTimer ] = useState(0);

    const refresh = async () => {
        setRefreshing(true);
        await refreshAsync();
        setRefreshing(false);
        setSinceRefreshTimer(0);
    };

    useEffect(() => {
        const sinceTimer = setInterval(() => setSinceRefreshTimer(timer => timer + 1), 1000);
        const refreshTimer = setInterval(refresh, interval);

        // clear timers when this component unmount.
        return () => {
            clearInterval(sinceTimer);
            clearInterval(refreshTimer);
        }
    }, []);

    return (
        <div onClick={refresh} style={{ marginRight: '10px', cursor: 'pointer' }}>
            <Tooltip title={`每${REFRESH_INTERVAL / 1000}秒自动刷新列表`}>
                {
                    refreshing ?
                        <>
                            <SyncOutlined spin />
                            <p style={{ display: 'inline', color: 'gray' }}> 自动刷新中 </p>
                        </> :
                        <>
                            <SyncOutlined/>
                            <p style={{ display: 'inline', color: 'gray' }}> 距上次自动更新 { sinceRefreshTimer } 秒 </p>
                        </>
                }
            </Tooltip>
        </div>
    )
};

export default RefreshTimer;
