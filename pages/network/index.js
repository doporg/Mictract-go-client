import MenuLayout from "components/MenuLayout/MenuLayout";
import {Button, Input, message, Table} from "antd";
import { useEffect, useState } from 'react';
import api from 'api';
import globalStyle from '../index.less';
import {PlusOutlined} from "@ant-design/icons";
import NetworkDrawer from "components/Network/NetworkDrawer/NetworkDrawer";

const { Search } = Input;

const NetworkPage = () => {
    const [ searching, setSearching ] = useState(false);
    const [ tableLoading, setTableLoading ] = useState(false);
    const [ sortedInfo, setSortedInfo ] = useState({});
    const [ filteredInfo, setFilteredInfo ] = useState({});
    const [ dataSource, setDataSource ] = useState([]);
    const [ drawerVisible, setDrawerVisible ] = useState(false);

    // TODO: handle error
    useEffect(() => {
        (async () => {
            const { data: networks } = await api.getNetworks();
            setDataSource(networks);
        })()
    }, []);

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
            key: 'consensus',
            dataIndex: 'consensus',
            title: '共识算法',
            filteredValue: filteredInfo?.consensus,
            filters: [
                { text: 'solo', value: 'solo' },
                { text: 'etcdRaft', value: 'etcdRaft' },
            ],
            onFilter: (value, record) => record.consensus.includes(value),
        },
        {
            key: 'orderers',
            dataIndex: 'orderers',
            title: '排序节点',
        },
        {
            key: 'organizations',
            dataIndex: 'organizations',
            title: '包含组织',
        },
    ];

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    }

    const handleSearch = async () => {
        setSearching(true);
        setTableLoading(true);
        // TODO: searching networks
        await new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 1000);
        })

        setSearching(false);
        setTableLoading(false);
    };

    const handleSubmit = () => {
        setDrawerVisible(false);
        const key = 'create network';
        message.loading({ content: "Creating new network", key });
        // TODO: interactions

        setTimeout(() => {
            const error = (new Date()) % 2 === 0;
            if (error) {
                message.success({ content: "The network has been created", key });
            } else {
                message.error({ content: "Error occurred when creating network", key });
            }
        }, 2000);
    }

    return (
        <MenuLayout>
            <div className={globalStyle.contentMargin} >
                <Button type="primary" onClick={() => setDrawerVisible(true)}>
                    <PlusOutlined /> 新增网络
                </Button>

                <Search
                    placeholder="按网络名查询"
                    loading={searching}
                    onSearch={searching ? undefined : handleSearch}
                    style={{
                        maxWidth: '300px',
                        float: 'right'
                    }}
                />
            </div>

            <NetworkDrawer
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                handleSubmit={handleSubmit}
            />

            <Table
                className={globalStyle.contentMargin}
                loading={tableLoading}
                columns={columns}
                dataSource={dataSource}
                onChange={handleChange}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />

        </MenuLayout>
    )
}

export default NetworkPage;
