
import React from 'react';
import 'antd/dist/antd.css';
import './loading.css';
import { Spin, Col , Alert } from 'antd';

class Loading extends React.Component {
  render() {
    return (
       <Col span={24}>
            <Col span={8}></Col>
            <Col span={9} style={{marginTop:"10%"}}>
                <Spin spinning={!this.props.status} size= "large">
                <Alert
                        message="Loading..."
                        description="Please wait while we load Data."
                        type="info"
                    />
                </Spin>
            </Col>
            <Col span={5}></Col>
       </Col>
    );
  }
}

export default  Loading;
          