import {Input, InputNumber, Table} from 'antd';
import * as R from 'ramda';

const PeerCountTable = ({
                            onPeerCountChange, onOrganizationNicknameChange,
                            peerCounts, organizationNicknames }) => {
    const zippedData = R.zip(peerCounts, organizationNicknames);

    const data = zippedData.map(([count, nickname], idx) => ({
        key: idx,
        name: `组织${idx+1}`,
        peerCount: count,
        organizationNickname: nickname,
    }));

    const onPeerCountChangeWrapped = key => count => onPeerCountChange(key, count);
    const onOrganizationNicknameChangeWrapped = key => nickname => onOrganizationNicknameChange(key, nickname);

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
        },
        {
            key: 'organizationNickname',
            dataIndex: 'organizationNickname',
            title: '组织昵称',
            render: (_, record) => {
                return <Input
                    min={1}
                    max={10}
                    value={record.organizationNickname}
                    onChange={e => onOrganizationNicknameChangeWrapped(record.key)(e.target.value)}
                />
            }
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
                    onChange={onPeerCountChangeWrapped(record.key)}
                />
            }
        },
    ];

    return (
        <Table columns={columns} dataSource={data} />
    );
};

export default PeerCountTable;
