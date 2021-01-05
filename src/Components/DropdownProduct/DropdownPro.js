
import React from 'react';
import 'antd/dist/antd.css';
import './DropdownPro.css';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

class DropdownPro extends React.Component{
    constructor(props){
        super(props);
            this.state={
                val:props.defaultValue,
                data1:[]
            }
    }

    componentDidMount(){
        axios.get(process.env.REACT_APP_DOMAIN+'/capricing/api/getCategories')
        .then(response=>{
            if (response.status === 200) {
                this.setState({
                    data1:response.data,
                })
            }
        })
        .catch(err=>err)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value !== "")
         this.setState({ val: nextProps.value});
        else
         this.setState({ val: nextProps.defaultValue});
    }

    handleChange = (value) =>{
       //alert(`selected ${value}`);
       this.props.select(value,this.props.id);
    }
    render(){
        return(
            <Select defaultValue= {this.props.defaultValue} style={{ width: 150, marginLeft:"-2em" , border:this.props.border }} showSearch onChange={this.handleChange} placeholder={this.props.placeholder} value={this.state.val} >
                {
                    this.state.data1.map((data,i)=>{
                    return(
                            <Option value={data} key={i}>{data}</Option>   
                          )
                    })
                }
            </Select>
        )
    }
}

export default DropdownPro;   