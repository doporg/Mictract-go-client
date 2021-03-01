import MenuLayout from "components/MenuLayout/MenuLayout";
import {Badge, Button, Input, message, Table, Tag} from "antd";
import { useEffect, useState } from 'react';
import api from 'api';
import globalStyle from '../index.less';
import {PlusOutlined} from "@ant-design/icons";
import NetworkDrawer from "components/Network/NetworkDrawer/NetworkDrawer";
import moment from 'moment';
import * as R from 'ramda';
import {useRouter} from "next/router";
import {Subject} from "rxjs";
import {debounceTime, throttleTime} from "rxjs/operators";

const { Search } = Input;

const NetworkPage = () => {
    const router = useRouter();
    const [ tableLoading, setTableLoading ] = useState(false);
    const [ sortedInfo, setSortedInfo ] = useState({});
    const [ filteredInfo, setFilteredInfo ] = useState({});
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
            const { data: networks } = await api.getNetworks();
            setDataSource(networks);
        })()
    }, []);

    const stopNetworkById = (id) => {
        return () => {
            const key = `stop network ${id}`;
            message.loading({ content: `stopping network`, key });
            // TODO: stop network

            setTimeout(() => {
                const error = (new Date()) % 2 === 0;
                if (error) {
                    message.success({ content: "The network has been stopped", key });
                } else {
                    message.error({ content: "Error occurred when stopping network", key });
                }
            }, 2000);
        }
    }

    const deleteNetworkById = (id) => {
        return () => {
            const key = `delete network ${id}`;
            message.loading({ content: `deleting network`, key });
            // TODO: delete network

            setTimeout(() => {
                const error = (new Date()) % 2 === 0;
                if (error) {
                    message.success({ content: "The network has been deleted", key });

                } else {
                    message.error({ content: "Error occurred when deleting network", key });
                }
            }, 2000);
        }
    }

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
            key: 'tlsEnabled',
            dataIndex: 'tlsEnabled',
            title: '开启TLS',
            render: value => {
                if (value === 'true')
                    return '是';
                return '否';
            }
        },
        {
            key: 'orderers',
            dataIndex: 'orderers',
            title: '排序节点',
            render: (value) => {
                const compute = R.pipe(
                    R.map((v, i) => <Tag color='cyan' key={i}> { v.split('.')[0] } </Tag>),
                    R.splitEvery(3),
                    R.map(row => [ ...row, <br /> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'organizations',
            dataIndex: 'organizations',
            title: '组织',
            render: (value) => {
                const compute = R.pipe(
                    R.map((v, i) => <Tag color='geekblue' key={i}> { v.split('.')[0] } </Tag>),
                    R.splitEvery(5),
                    R.map(row => [ ...row, <br /> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'createTime',
            dataIndex: 'createTime',
            title: '创建时间',
            render: value => moment(parseInt(value)).format('YYYY-MM-DD'),
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('running'),  v => [ v, 'success' ] ],
                    [ R.equals('starting'), v => [ v, 'processing' ] ],
                    [ R.equals('stopped'),  v => [ v, 'warning' ] ],
                    [ R.equals('error'),    v => [ v, 'error' ] ],
                ]),
                ([ v, status ]) => {
                    return <Tag color={status}><Badge status={status} text={v}/></Tag>;
                },
            )
        },
        {
            key: 'actions',
            dataIndex: 'actions',
            title: '操作',
            render: (_, { key }) => {
                return (
                    <>
                        <Button onClick={() => router.push(`/network/${key}`)}>查看</Button>
                        <Button onClick={stopNetworkById(key)}>停止</Button>
                        <Button onClick={deleteNetworkById(key)}>删除</Button>
                    </>
                );
            }
        }
    ];

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    }


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
                    onSearch={handleSearch}
                    onChange={e => searchInputChange$.next(e.target.value)}
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

export default NetworkPage;
