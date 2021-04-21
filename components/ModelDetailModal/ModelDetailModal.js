import {Descriptions, Modal, PageHeader, Table, Tabs} from "antd";

const seekProperty = (record, path) => {
    if (!Array.isArray(path)) return record[path];

    for (const elem of path) {
        if (!record.hasOwnProperty(elem))
            return undefined;
        record = record[elem];
    }
    return record;
};

const renderDescriptions = (model, record) => {
    return (
        <Descriptions column={1} bordered>
            {
                model
                    .map(col => {
                        const value = seekProperty(record, col.dataIndex);
                        const render = col?.render ?? ( x => x );

                        return <Descriptions.Item label={col.title}> { render(value, record) } </Descriptions.Item>
                    })
            }
        </Descriptions>
    );
}

const renderArrayModal = (model, record) => {
    const renderArrayTables = (model, record) => {
        return (
            <>
                {
                    model
                        .map(col => {
                            const value = seekProperty(record, col.dataIndex);
                            const columns = col.columns;
                            const valueWithKey = value.map((v, key) => {
                                if (v.key === undefined) return {key, ...v};
                                return v;
                            });

                            return <Table rowKey={'key'} columns={columns} dataSource={valueWithKey}/>;
                        })
                }
            </>
        );
    };

    return (
        <PageHeader
            footer={
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="更多" key="1"> { renderArrayTables(model.filter(x => x.isArray), record) } </Tabs.TabPane>
                </Tabs>
            }
        >
            { renderDescriptions(model.filter(x => !x.isArray), record) }
        </PageHeader>
    );
};

const ModelDetailModal = ({ containsArray, model, visible, record, onCancel, width }) => {
    if (!visible) return '';

    const renderContent = () => {
        if (containsArray)
            return renderArrayModal(model, record);
        return renderDescriptions(model.filter(x => !x.isArray), record);
    }

    return (
        <Modal
            title={'数据详情'}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={width}
        >
            { renderContent() }
        </Modal>
    )
};

export default ModelDetailModal;
