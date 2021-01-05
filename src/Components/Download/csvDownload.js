import React from "react";
import {Icon} from "antd";
import { CSVLink } from "react-csv";
 
class Download extends React.Component{
     constructor(props){
         super(props);
         this.state={
             csvData: props.data
         }
     }
    
     componentWillReceiveProps(nextProps){
         this.setState({
             csvData: nextProps.data
         })
     }
    render(){
        return(<CSVLink data={this.state.csvData} filename={this.props.downloadFolderName} target="_blank" style={{cursor:"pointer !important"}}><Icon type="download" />Download me</CSVLink>)
    }
}
export default Download;