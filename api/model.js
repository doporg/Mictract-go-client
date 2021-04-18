import * as R from "ramda";
import {Badge, Tag} from "antd";
import moment from "moment";

export const models = {
    network: [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            sorter: (a, b) => a.id - b.id,
        },
        {
            key: 'nickname',
            dataIndex: 'nickname',
            title: '昵称',
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
        },
        {
            key: 'consensus',
            dataIndex: 'consensus',
            title: '共识算法',
            filters: [
                { text: 'solo', value: 'solo' },
                { text: 'etcdRaft', value: 'etcdraft' },
            ],
            onFilter: (value, record) => record.consensus.includes(value),
        },
        {
            key: 'tlsEnabled',
            dataIndex: 'tlsEnabled',
            title: '开启TLS',
            render: value => value ? '是' : '否',
        },
        {
            key: 'orderers',
            dataIndex: 'orderers',
            title: '排序节点ID',
            render: value => {
                const compute = R.pipe(
                    R.map(({ id: ordererID }) => <Tag color='cyan' key={ordererID}> { ordererID } </Tag>),
                    R.splitEvery(3),
                    R.addIndex(R.map)((row, i) => [ ...row, <br key={i}/> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'organizations',
            dataIndex: 'organizations',
            title: '组织ID',
            render: value => {
                const compute = R.pipe(
                    R.map(({ id: organizationID }) => <Tag color='geekblue' key={organizationID}> { organizationID } </Tag>),
                    R.splitEvery(5),
                    R.addIndex(R.map)((row, i) => [ ...row, <br key={i}/> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'createTime',
            dataIndex: 'createTime',
            title: '创建时间',
            render: value => moment.unix(value).format('YYYY-MM-DD'),
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('running'),  () => [ '运行中', 'success' ] ],
                    [ R.equals('starting'), () => [ '创建中', 'processing' ] ],
                    [ R.equals('stopped'),  () => [ '已停止', 'warning' ] ],
                    [ R.equals('error'),    () => [ '已出错', 'error' ] ],
                    [ R.T,                    () => [ '未知错', 'error' ] ],
                ]),
                ([ v, status ]) => {
                    return <Tag color={status}><Badge status={status} text={v}/></Tag>;
                },
            )
        },
        // {
        //     key: 'actions',
        //     dataIndex: 'actions',
        //     title: '操作',
        //     render: (_, { id: networkID }) => {
        //         // TODO: link to `/monitor/[id]`
        //         return (
        //             <Button.Group key={networkID}>
        //                 <Button onClick={() => router.push(`/network/${networkID}`)}>查看</Button>
        //                 <Button onClick={handleDeleteNetwork(networkID)}>删除</Button>
        //             </Button.Group>
        //         );
        //     }
        // }
    ],

    organization: [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            sorter: (a, b) => a.id - b.id,
        },
        {
            key: 'nickname',
            dataIndex: 'nickname',
            title: '昵称',
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
        },
        {
            key: 'peers',
            dataIndex: 'peers',
            title: '包含节点',
            render: R.pipe(
                R.map(({ id }) => <Tag key={id} color={'purple'}>{id}</Tag>),
                R.splitEvery(5),
                R.addIndex(R.map)((arr, i) => R.append(<br key={i}/>)(arr)),
                R.flatten,
            ),
        },
        {
            key: 'networkID',
            dataIndex: 'networkID',
            title: '所属网络ID',
            render: value => <Tag key={value} color={'green'}>{value}</Tag>
        },
    ],

    user: [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            sorter: (a, b) => a.id - b.id,
        },
        {
            key: 'nickname',
            dataIndex: 'nickname',
            title: '昵称',
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
        },
        {
            key: 'role',
            dataIndex: 'role',
            title: '角色',
            filters: [
                { text: 'admin', value: 'admin' },
                { text: 'user', value: 'user' },
            ],
            onFilter: (value, record) => record.role.includes(value),
            render: value => {
                if (value === 'admin')
                    return <Tag color={'red'}>{value}</Tag>;
                else
                    return <Tag color={'blue'}>{value}</Tag>;
            }
        },
        {
            key: 'organizationID',
            dataIndex: 'organizationID',
            title: '所属组织ID',
            render: value => <Tag color={'geekblue'}>{value}</Tag>
        },
        {
            key: 'networkID',
            dataIndex: 'networkID',
            title: '所属网络ID',
            render: value => <Tag color={'green'}>{value}</Tag>
        },
        // {
        //     key: 'actions',
        //     dataIndex: 'actions',
        //     title: '操作',
        //     render: (_, { id }) => {
        //         return (
        //             <Button.Group key={id}>
        //                 <Button onClick={handleDeleteUser(id)}>删除</Button>
        //             </Button.Group>
        //         );
        //     }
        // }
    ],

    channel: [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            sorter: (a, b) => a.id - b.id,
        },
        {
            key: 'nickname',
            dataIndex: 'nickname',
            title: '昵称',
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
        },
        {
            key: 'organizations',
            dataIndex: 'organizations',
            title: '包含组织ID',
            render: R.pipe(
                R.map(({ id }) => <Tag key={id} color={'purple'}>{id}</Tag>),
                R.splitEvery(5),
                R.addIndex(R.map)((arr, i) => R.append(<br key={i}/>)(arr)),
                R.flatten,
            ),
        },
        {
            key: 'networkID',
            dataIndex: 'networkID',
            title: '所属网络ID',
            render: value => <Tag key={value} color={'green'}>{value}</Tag>
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('running'),  () => [ '运行中', 'success' ] ],
                    [ R.equals('starting'), () => [ '创建中', 'processing' ] ],
                    [ R.equals('stopped'),  () => [ '已停止', 'warning' ] ],
                    [ R.equals('error'),    () => [ '已出错', 'error' ] ],
                    [ R.T,                     () => [ '未知错', 'error' ] ],
                ]),
                ([ v, status ]) => {
                    return <Tag color={status}><Badge status={status} text={v}/></Tag>;
                },
            )
        },
    ],

    chaincode: [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            sorter: (a, b) => a.id - b.id,
        },
        {
            key: 'nickname',
            dataIndex: 'nickname',
            title: '昵称',
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
        },
        {
            key: 'label',
            dataIndex: 'label',
            title: '标签',
        },
        // the data of those fields below is too long.
        // for better presentation, these are moved into the modal in the page.
        // the field `isDetailInformation: true` is used to do this.
        {
            key: 'packageID',
            dataIndex: 'packageID',
            title: '包ID',
            isDetailInformation: true,
        },
        {
            key: 'address',
            dataIndex: 'address',
            title: '地址',
            isDetailInformation: true,
        },
        {
            key: 'policy',
            dataIndex: 'policy',
            title: '策略',
        },
        {
            key: 'version',
            dataIndex: 'version',
            title: '版本',
        },
        {
            key: 'sequence',
            dataIndex: 'sequence',
            title: '序列号',
        },
        {
            key: 'initRequired',
            dataIndex: 'initRequired',
            title: '需要初始化',
            render: value => value ? '是' : '否',
        },
        {
            key: 'channelID',
            dataIndex: 'channelID',
            title: '所属通道ID',
            render: value => <Tag color={'purple'}>{value}</Tag>
        },
        {
            key: 'networkID',
            dataIndex: 'networkID',
            title: '所属网络ID',
            render: value => <Tag color={'green'}>{value}</Tag>
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('starting'),     () => [ '创建中', 'processing' ] ],
                    [ R.equals('unpacking'),    () => [ '解压中', 'processing' ] ],
                    [ R.equals('installing'),   () => [ '安装中', 'processing' ] ],
                    [ R.equals('building'),     () => [ '构建中', 'processing' ] ],
                    [ R.equals('running'),      () => [ '运行中', 'success' ] ],
                    [ R.equals('stopped'),      () => [ '已停止', 'warning' ] ],
                    [ R.equals('error'),        () => [ '已出错', 'error' ] ],
                    [ R.T,                    () => [ '未知错', 'error' ] ],
                ]),
                ([ v, status ]) => {
                    return <Tag color={status}><Badge status={status} text={v}/></Tag>;
                },
            )
        },
        // {
        //     key: 'actions',
        //     dataIndex: 'actions',
        //     title: '操作',
        //     render: (_, { ccid }) => {
        //         return (
        //             <Button.Group key={ccid}>
        //                 <Button onClick={handleInvokeChaincode(ccid)}>调用链码</Button>
        //             </Button.Group>
        //         );
        //     }
        // }
    ],

    chaincodeTransaction: [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            sorter: (a, b) => a.id - b.id,
        },
        {
            key: 'txID',
            dataIndex: 'txID',
            title: '交易ID',
            sorter: (a, b) => a.txID - b.txID,
            isDetailInformation: true,
        },
        {
            key: 'invokeType',
            dataIndex: 'invokeType',
            title: '调用类型',
            filters: [
                { text: 'init', value: 'init' },
                { text: 'query', value: 'query' },
                { text: 'execute', value: 'execute' },
            ],
            onFilter: (value, record) => record.invokeType.includes(value),
            render: value => <Tag color={'blue'}>{value}</Tag>
        },
        {
            key: 'args',
            dataIndex: 'args',
            title: '参数',
            render: value => {
                const getTag = (arg, idx) => {
                    console.log(arg, idx);
                    if (idx === 0)
                        return <Tag color='red' key={arg}> { arg } </Tag>;
                    return <Tag key={arg}> { arg } </Tag>;
                };

                const compute = R.pipe(
                    R.addIndex(R.map)((arg, idx) => getTag(arg, idx)),
                    R.splitEvery(5),
                    R.addIndex(R.map)((row, i) => [ ...row, <br key={i}/> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'message',
            dataIndex: 'message',
            title: '消息',
            isDetailInformation: true,
        },
        {
            key: 'userID',
            dataIndex: 'userID',
            title: '用户ID',
            render: value => <Tag key={value} color={'purple'}>{value}</Tag>
        },
        {
            key: 'chaincodeID',
            dataIndex: 'chaincodeID',
            title: '所属链码ID',
            render: value => <Tag key={value} color={'green'}>{value}</Tag>
        },
        {
            key: 'peerURLs',
            dataIndex: 'peerURLs',
            title: 'Peer URL',
            render: value => {
                const compute = R.pipe(
                    R.map(url => <Tag color='cyan' key={url}> { url } </Tag>),
                    R.splitEvery(3),
                    R.addIndex(R.map)((row, i) => [ ...row, <br key={i}/> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('success'),  () => [ '已成功', 'success' ] ],
                    [ R.equals('execute'),  () => [ '执行中', 'processing' ] ],
                    [ R.equals('error'),    () => [ '已出错', 'error' ] ],
                    [ R.T,                  () => [ '未知错', 'error' ] ],
                ]),
                ([ v, status ]) => {
                    return <Tag color={status}><Badge status={status} text={v}/></Tag>;
                },
            )
        },
    ],
};

export const modelColumns =
    R.map(R.filter(item => (item?.isDetailInformation ?? false) === false))(models)
