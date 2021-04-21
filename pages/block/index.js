import MenuLayout, {refreshDataSource} from "../../components/MenuLayout/MenuLayout";
import globalStyle from "../index.less";
import {Button, Form, notification, Select, Table} from "antd";
import {useEffect, useState} from "react";
import api from "api";
import {modelColumns, models} from "../../api/model";
import ModelDetailModal from "../../components/ModelDetailModal/ModelDetailModal";

const BlockPage = () => {
    const [ selectLoading, setSelectLoading ] = useState(true);
    const [ tableLoading, setTableLoading ] = useState(true);

    const [ channels, setChannels ] = useState(undefined);
    const [ selectedChannelID, setSelectedChannelID ] = useState(-1);
    useEffect(() => {
        (async () => {
            await refreshDataSource(api.listChannels, setChannels);
        })();
    }, []);

    useEffect(() => {
        if (channels === undefined) {
            return;
        } else if (channels.length > 0) {
            setSelectedChannelID(channels[0].id);
            setSelectLoading(false);
        } else {
            notification.warn({ message: '没有自定义通道存在' });
        }
    }, [ channels ]);

    const [ dataSource, setDataSource ] = useState([]);
    useEffect(() => {
        if (selectedChannelID < 0) return;

        setTableLoading(true);
        (async () => {
            const req = {
                channelID: selectedChannelID,
                page: 1,
                pageSize: 10,
            };

            await refreshDataSource(() => api.listBlocksByChannelIdWithPage(req), setDataSource);
            setTableLoading(false);
        })();
    }, [ selectedChannelID ]);

    const [ modalVisible, setModalVisible ] = useState(false);
    const [ modalRecord, setModalRecord ] = useState({});
    const handleShowDetailModal = record => {
        setModalVisible(true);
        setModalRecord(record);
    };

    const columns = [ ...modelColumns.block ];
    columns.push({
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        render: (_, record) => {
            const dataHash = record.rawBlock.header.data_hash;
            return (
                <Button.Group key={dataHash}>
                    <Button onClick={() => handleShowDetailModal(record)}>查看</Button>
                </Button.Group>
            );
        }
    });

    return (
        <>
            <MenuLayout>
                <div className={globalStyle.contentMargin} >
                    <Form>
                        <Form.Item label={'选择通道'}>
                            {
                                selectLoading ? <Select placeholder={'加载通道中'} loading/> :
                                    <Select
                                        value={selectedChannelID}
                                        onChange={setSelectedChannelID}
                                    >
                                        {
                                            channels
                                                .map(({ id: channelID, nickname }) =>
                                                    <Select.Option key={channelID} value={channelID}>{`${channelID} - ${nickname}`}</Select.Option>)
                                        }
                                    </Select>
                            }

                        </Form.Item>
                    </Form>
                </div>

                <Table
                    className={globalStyle.contentMargin}
                    loading={tableLoading}
                    rowKey={ 'dataHash' }
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: (value) => console.log(value),
                    }}
                />

            </MenuLayout>

            <ModelDetailModal
                containsArray
                model={models.block}
                visible={modalVisible}
                record={modalRecord}
                onCancel={() => setModalVisible(false)}
                width={1500}
            />
        </>
    );
};

export default BlockPage;
