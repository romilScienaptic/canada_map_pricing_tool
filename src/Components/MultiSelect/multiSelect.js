
import React from 'react';
import 'antd/dist/antd.css';
import './multiSelect.css';
import { Select, Icon } from 'antd';

let data = [], flag = false;
class MultipleSelect extends React.Component {
    constructor (props) {
        super(props);
        if(props.defaultValue !== undefined){
          this.state = {
            selectedItems: props.defaultValue
          };
        }
        else{
          this.state = {
            selectedItems: []
          };
        }
        
    }
  
  handleChange = (selectedItems,event) => {
    data.length = 0;
    data = selectedItems;
    flag = true;
    this.setState({ selectedItems});
    this.props.multipleSelect(selectedItems,event);
  };

  componentWillReceiveProps(nextProps){
    let newData =[];
    if(flag === false){
      newData = [];
    }
    else{
      newData = data;
    }
    if(nextProps.defaultValue !== undefined){
      if(nextProps.defaultValue.length !== 0){
        if(flag === false && nextProps.defaultValue.length !== 0){
          this.setState({ selectedItems: nextProps.defaultValue});
          flag = false;
        }
        else if(flag === true && nextProps.defaultValue.length !== 0){
          this.setState({ selectedItems: newData});
          flag = false;
        }
        else if(nextProps.defaultValue.length === 0){
            this.setState({selectedItems: nextProps.defaultValue });
            //
            flag = false;
        }
        else{
            this.setState({selectedItems: newData });
            //
            flag = false;
        }
      }
      else{
        this.setState({selectedItems: newData });
        flag = false;
      }
    }
    else if(nextProps.defaultValue !== undefined){
      if(nextProps.defaultValue.length === 0 && flag === true)
        this.setState({ selectedItems: newData});
        flag = false;
    }
    else if(nextProps.value !== undefined){
        if(nextProps.value.length === 0){
          this.setState({ selectedItems: nextProps.value});
          flag = false;
        }
    }
    else if(nextProps.defaultValue === undefined){
        this.setState({ selectedItems: newData});
        flag = true;
    }
  }
  

  render() {
    const { selectedItems } = this.state;
    const filteredOptions = this.props.dataOptions.filter(o => !selectedItems.includes(o));
    return (
      <Select
        mode="multiple"
        placeholder={this.props.placeholder}
        value={selectedItems}
        onChange={this.handleChange}
        style={{ width: this.props.width}}  
        id ="multipleSelect" 
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default MultipleSelect;