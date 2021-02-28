import {InputNumber, Table} from 'antd';

const PeerCountTable = ({ onChange, peerCounts }) => {
    const peerCountsData = peerCounts.map((count, idx) => ({
        key: idx,
        name: `组织${idx+1}`,
        peerCount: count,
    }));

    const onPeerCountChange = key => count => onChange(key, count);

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
        },
        {
            key: 'peerCount',
            dataIndex: 'peerCount',
            title: '节点个数',
            render: (_, record) => {
                return <InputNumber
                    min={1}
                    max={10}
                    value={record.peerCount}
                    onChange={onPeerCountChange(record.key)}
                />
            }
        },
    ];

    return (
        <Table columns={columns} dataSource={peerCountsData} />
    );
};

export default PeerCountTable;
