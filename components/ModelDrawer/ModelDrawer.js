import {Button, Drawer} from "antd";

const ModelDrawer = ({ title, onClose, visible, handleSubmit, children }) => {
    const submit = () => {
        onClose();
        handleSubmit();
    };

    return (
        <Drawer
            title={title}
            width={450}
            placement="right"
            closable
            onClose={onClose}
            visible={visible}
            getContainer={'#content-holder'}
            style={{ position: 'absolute' }}
            footer={
                <div style={{textAlign: 'right'}}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={submit} type="primary">Submit</Button>
                </div>
            }
        >
            { children }
        </Drawer>
    );
};

export default ModelDrawer;
