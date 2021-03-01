import MenuLayout from "components/MenuLayout/MenuLayout";
import {Button, Input, message, Table} from "antd";
import { useEffect, useState } from 'react';
import globalStyle from 'pages/index.less';
import {PlusOutlined} from "@ant-design/icons";
import {Subject} from "rxjs";
import {debounceTime, throttleTime} from "rxjs/operators";
import ModelDrawer from "../ModelDrawer/ModelDrawer";

const { Search } = Input;

const ModelPage = ({ columns, dataSourcePromiseFn, setSortedInfo, setFilteredInfo, drawerTitle, handleSubmit, children }) => {
    const [ tableLoading, setTableLoading ] = useState(false);
    const [ dataSource, setDataSource ] = useState([]);
    const [ drawerVisible, setDrawerVisible ] = useState(false);
    const [ searchName, setSearchName ] = useState('');

    const handleSearch = (value) => {
        setSearchName(value);
        setTableLoading(false);
    };

    const searchInputChange$ = new Subject();
    searchInputChange$
        .pipe(
            throttleTime(1000),
            debounceTime(100),
        ).subscribe(handleSearch)
    searchInputChange$
        .subscribe(() => {
            setTableLoading(true);
        })

    // TODO: handle error
    useEffect(() => {
        (async () => {
            const { data: networks } = await dataSourcePromiseFn();
            setDataSource(networks);
        })()
    }, []);

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    }

    return (
        <MenuLayout>
            <div className={globalStyle.contentMargin} >
                <Button type="primary" onClick={() => setDrawerVisible(true)}>
                    <PlusOutlined /> { drawerTitle }
                </Button>

                <Search
                    placeholder="按名查询"
                    onSearch={handleSearch}
                    onChange={e => searchInputChange$.next(e.target.value)}
                    style={{
                        maxWidth: '300px',
                        float: 'right'
                    }}
                />
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
                columns={columns}
                dataSource={dataSource.filter(x => x.name.includes(searchName))}
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