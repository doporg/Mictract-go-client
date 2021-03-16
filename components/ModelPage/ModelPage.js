import MenuLayout from "components/MenuLayout/MenuLayout";
import {Button, Input, message, Table} from "antd";
import { useEffect, useState } from 'react';
import globalStyle from 'pages/index.less';
import {PlusOutlined} from "@ant-design/icons";
import {Subject} from "rxjs";
import {debounceTime, throttleTime} from "rxjs/operators";
import ModelDrawer from "../ModelDrawer/ModelDrawer";

const { Search } = Input;

const ModelPage = ({ columns, dataSource, rowKey, setSortedInfo, setFilteredInfo, drawerTitle, handleSubmit, children }) => {
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
            throttleTime(1000),
            debounceTime(100),
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

    return (
        <MenuLayout>
            <div className={globalStyle.contentMargin} >
                <Search
                    placeholder="按名查询"
                    onSearch={handleSearch}
                    onChange={e => searchInputChange$.next(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />

                <Button
                    type="primary"
                    onClick={() => setDrawerVisible(true)}
                    style={{ float: 'right' }}
                >
                    <PlusOutlined /> { drawerTitle }
                </Button>
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
                dataSource={dataSource.filter(x => x.name.toLowerCase().includes(searchName.toLowerCase()))}
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
