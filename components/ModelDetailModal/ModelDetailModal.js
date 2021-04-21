import {Descriptions, Modal} from "antd";

const ModelDetailModal = ({ model, visible, record, onCancel }) => {
    if (!visible) return '';
    const seekProperty = (record, path) => {
        if (!Array.isArray(path)) return record[path];

        for (const elem of path) {
            if (!record.hasOwnProperty(elem))
                return undefined;
            record = record[elem];
        }
        return record;
    };

    return (
        <Modal
            title={'数据详情'}
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
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
        </Modal>
    )
};

export default ModelDetailModal;
