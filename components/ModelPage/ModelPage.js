import MenuLayout from "components/MenuLayout/MenuLayout";
import {Button, Input, message, Table, Tooltip} from "antd";
import { useEffect, useState } from 'react';
import globalStyle from 'pages/index.less';
import {PlusOutlined, SyncOutlined} from "@ant-design/icons";
import {interval, Observable, Subject} from "rxjs";
import {debounceTime, throttleTime} from "rxjs/operators";
import ModelDrawer from "../ModelDrawer/ModelDrawer";

const { Search } = Input;

const
    THROTTLE_TIME = 1000,
    DEBOUNCE_TIME = 100,
    REFRESH_INTERVAL = 30 * 1000;

const ModelPage = ({
                       columns, dataSource, rowKey, setSortedInfo, setFilteredInfo,
                       enableRefresh, onRefreshAsync,
                       drawerTitle, handleSubmit, children }) => {
    const [ tableLoading, setTableLoading ] = useState(false);
    const [ drawerVisible, setDrawerVisible ] = useState(false);
    const [ searchName, setSearchName ] = useState('');

    const handleSearch = (value) => {
        setSearchName(value);
        setTableLoading(false);
    };

    const searchInputChange$ = new Subject();
    searchInputChange$
        .pipe(
            throttleTime(THROTTLE_TIME),
            debounceTime(DEBOUNCE_TIME),
        ).subscribe(handleSearch)
    searchInputChange$
        .subscribe(() => {
            setTableLoading(true);
        })

    const handleChange = (pagination, filters, sorter) => {
        if (setFilteredInfo)
            setFilteredInfo(filters);
        if (setSortedInfo)
            setSortedInfo(sorter);
    }

    const [ refreshing, setRefreshing ] = useState(false);
    const [ refreshSecond, setRefreshSecond ] = useState(0);

    const refresh = async () => {
        setRefreshing(true);
        await onRefreshAsync();
        setRefreshing(false);
        setRefreshSecond(0);
    };

    const refresher = (
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
                            <p style={{ display: 'inline', color: 'gray' }}> 距上次自动更新 { refreshSecond } 秒 </p>
                        </>
                }
            </Tooltip>
        </div>
    );

    if (enableRefresh) {
        useEffect(() => {
            const secondTimer = setInterval(() => setRefreshSecond(timer => timer + 1), 1000);
            const timer = setInterval(refresh, REFRESH_INTERVAL);

            // clear timers when this component unmount.
            return () => {
                clearInterval(secondTimer);
                clearInterval(timer);
            }
        }, []);
    }

    return (
        <MenuLayout>
            <div className={globalStyle.contentMargin} >
                <Search
                    placeholder="按名查询"
                    onSearch={handleSearch}
                    onChange={e => searchInputChange$.next(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />

                <div style={{ float: 'right', display: 'flex', alignItems: 'center' }}>
                    { enableRefresh ? refresher: '' }

                    <Button
                        type="primary"
                        onClick={() => setDrawerVisible(true)}
                    >
                        <PlusOutlined /> { drawerTitle }
                    </Button>
                </div>
            </div>

            <ModelDrawer
                title={ drawerTitle }
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                handleSubmit={handleSubmit}
            >
                { children }
            </ModelDrawer>

            <Table
                className={globalStyle.contentMargin}
                loading={tableLoading}
                rowKey={rowKey}
                columns={columns}
                dataSource={dataSource.filter(x => {
                    if (x.nickname !== undefined)
                        return x.nickname.toLowerCase().includes(searchName.toLowerCase())
                    console.log(x);
                    return x.name.toLowerCase().includes(searchName.toLowerCase())
                })}
                onChange={handleChange}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />

        </MenuLayout>
    )
}

export default ModelPage;
