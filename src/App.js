import React from 'react';
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from './View/Home/home';
import History from './View/History/history';
import NotMapped from './View/NotMapped/notMapped';
import Contact from './View/ContactList/contactList';
import offMap from './View/OffMap/offMap';
// import login from './View/login/login';
import { Col, Row } from 'antd';
import "antd/dist/antd.css";
import Hp from "./assets/images/Hp.png";
import Tab from './Components/Tab/Tab';
class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Row style={{ marginTop: "1em" }}>
            <Col span={22}>
              <Col span={1}></Col>
              <Col span={4} style={{ marginTop: "1%", marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo" /><span style={{ color: "#0095d9", fontWeight: 600, fontSize: "16px", marginLeft: "2%" }}>MAP Pricing</span></Col>
              <Col span={2}></Col>
              <Col span={10}></Col>
              <Col span={5}></Col>
            </Col>
          </Row>
          <Switch>
            {/*<Route exact path="/" component={login}></Route>*/}
            <Route path="/" exact component={Tab} />
            {/* <Route path="/history" exact component={History}></Route>
            <Route path="/offMap" exact component={offMap}></Route>
            <Route path="/notMapped" exact component={NotMapped}></Route>
            <Route path="/contact" exact component={Contact}></Route> */}
          </Switch>
        </Router>
      </div>
    )
  }
}

export default (App);
