import React from 'react';
import "antd/dist/antd.css";
import { Tabs,Col,Row } from 'antd';
import Home from '../../View/Home/home';
import History from '../../View/History/history';
import NotMapped from '../../View/NotMapped/notMapped';
import OffMap from '../../View/OffMap/offMap';
import ContactList from '../../View/ContactList/contactList';

import "./Tab.css";
const { TabPane } = Tabs;

class Tab extends React.Component {
    render() {
        return (
            <div className="card-container">
                <Tabs type="card" className="tab-parent">
                    <TabPane tab="CURRENT" key="1">
                        <Home/>
                    </TabPane>

                    <TabPane tab="HISTORY" key="2" >
                        <History/>
                    </TabPane>

                    <TabPane tab="OFF MAP" key="3" >
                        <OffMap/>
                    </TabPane>
                    
                    <TabPane tab="NOT MAP'ED" key="4" >
                        <NotMapped/>
                    </TabPane>

                    <TabPane tab="CONTACT LIST" key="5" >
                        <ContactList/>
                    </TabPane>
                </Tabs>
                </div>
        )
    }
}
export default Tab;