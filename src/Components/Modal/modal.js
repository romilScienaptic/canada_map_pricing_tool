import React from "react";
import { Modal,Button } from "antd";

class ModalClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }
    handleCancel = () => {
        this.props.cancel();
    }

    handleOk = () =>{
        this.props.submit();
    }
    render() {
        return (
            <Modal
                visible={this.props.visible}
                // onCancel={this.handleCancel}
                closable={this.props.closable}
                style={{ top: 50 }}
                width={this.props.width}
                footer={null}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      {this.props.buttonValue2}
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                      {this.props.buttonValue1}
                    </Button>,
                  ]}>
                <div style={{ marginTop: "2em" }}>{this.props.template}</div>
            </Modal>
        )
    }
}
export default ModalClass;