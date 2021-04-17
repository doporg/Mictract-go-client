import MenuLayout, {handleErrorWithMessage} from "components/MenuLayout/MenuLayout";
import {Button, Input, message, Table, Tooltip} from "antd";
import { useEffect, useState } from 'react';
import globalStyle from 'pages/index.less';
import {PlusOutlined, SyncOutlined} from "@ant-design/icons";
import {interval, Observable, Subject} from "rxjs";
import {debounceTime, throttleTime} from "rxjs/operators";
import ModelDrawer from "../ModelDrawer/ModelDrawer";
import RefreshTimer from "../RefreshTimer/RefreshTimer";

const { Search } = Input;

const
    THROTTLE_TIME = 1000,
    DEBOUNCE_TIME = 100;

const ModelPage = ({
                       drawerTitle,
                       columns, dataSourceAsync, rowKey = 'id',
                       refreshEnabled, refreshSubject,
                       handleSubmit,
                       children }) => {
    const [ tableLoading, setTableLoading ] = useState(false);
    const [ drawerVisible, setDrawerVisible ] = useState(false);

    const [ searchName, setSearchName ] = useState('');
    const handleSearch = (searchName) => {
        setSearchName(searchName);
        setTableLoading(false);
    };

    const searchInputChange$ = new Subject();
    searchInputChange$
        .pipe(
            throttleTime(THROTTLE_TIME),
            debounceTime(DEBOUNCE_TIME),
        ).subscribe(handleSearch);

    searchInputChange$
        .subscribe(() => {
            setTableLoading(true);
        });

    const [ dataSource, setDataSource ] = useState([]);
    const refreshAsync = async () => {
        try {
            const { data: {payload: dataSource} } = await dataSourceAsync();
            setDataSource(dataSource);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'refreshing',
            });
        }
    };
    useEffect(() => {
        refreshAsync()
    }, []);

    refreshSubject.subscribe(refreshAsync);

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
                    { refreshEnabled ? <RefreshTimer refreshAsync={refreshAsync} />: '' }

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
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />

        </MenuLayout>
    )
}

export default ModelPage;
