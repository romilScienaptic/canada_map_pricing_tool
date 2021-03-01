
import React from 'react';
import 'antd/dist/antd.css';
import { DatePicker } from 'antd';
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
class Datepicker extends React.Component{

    constructor(props){
        super(props);
            this.state={
                val:props.defaultValue,
                size:props.size
            }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.value !== "")
         this.setState({ val: nextProps.value});
        else
         this.setState({ val: nextProps.defaultValue});

        //  if(nextProps.defaultValue === ""){
        //      this.setState({
        //          val : moment().format('MM/DD/YYYY')
        //      })
        //  }
    }

    onChange = (date,dateString) =>{
        this.props.action(date,dateString,this.props.id);
    }
    render(){
        return(this.props.defaultVal === false ?
            (<DatePicker allowClear id={this.props.id}  onChange={this.onChange} format={dateFormat} size={this.state.size}  style={{width:this.props.width,border:this.props.validate, borderRadius:this.props.borderRadius}} value={this.state.val !== "" ? moment(this.state.val) : null}/>)
            :(<DatePicker allowClear id={this.props.id} onChange={this.onChange} format={dateFormat} size={this.state.size}   style={{width:this.props.width,border:this.props.validate, borderRadius:this.props.borderRadius}} value={this.state.val !== "" && this.state.val !== undefined ? moment(this.state.val) : null}/>)
        );
    }
}
//value={moment(this.state.val)}
export default Datepicker;
          