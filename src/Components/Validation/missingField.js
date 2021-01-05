
import React from 'react';
import 'antd/dist/antd.css';
import './missingField.css';
import { Alert } from 'antd';

class missingField extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleClose = () => {
    this.setState({ visible: false });
  };

  componentWillReceiveProps(nextProps){
    this.setState({ visible: nextProps.show });
  }

  render() {
    return (
      <div>
        {this.state.visible ? (
          <Alert
            message={this.props.message}
            type="error"
            closable
            afterClose={this.handleClose}
          />
        ) : null}
      </div>
    );
  }
}

export default missingField;
          