import React from "react";
import "./history.css";
import "antd/dist/antd.css";
import Tab from "../../Components/Tab/Tab";
import DropdownProduct from '../../Components/DropdownProduct/DropdownPro';
import { Table, Input, Col, Tooltip, Form, Button, message, Row, Divider } from "antd";
import Dropdown from '../../Components/Select/select';
import Download from '../../Components/Download/csvDownload';
import axios from 'axios';
// import ModalClass from '../../Components/Modal/modal';
// import MultipleSelect from '../../Components/MultiSelect/multiSelect';
// import Datepicker from '../../Components/Datepicker/datepicker';
import Loading from '../../Components/Loading/loading';
import Hp from "../../assets/images/Hp.png";
import _ from 'lodash';

// import moment from 'moment';
import jsonData from '../../history.json';

let record = [];
const dropdownData = ["Mainstream", "Derivative"];
const ButtonGroup = Button.Group;
const EditableContext = React.createContext();
// const dateFormat = 'MM/DD/YYYY';

let flagSkuType = false, flagOption = false, flagsku = false, flagDerivative = false, flagProductCategory = false;
let dateEditable;

class EditableCell extends React.Component {

  onChange = (date, dateString) => {
    dateEditable = dateString;
  }

  getInput = () => {
    if (this.props.inputType === "date") {
      //return <Date />
      console.log(this.props);
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      policy: [],
      SKUType: [],
      Tier: [],
      updateData: [],
      editingKey: "",
      flag: true,
      dateEdit: '',
      visible: false,
      addSKU: false,
      html: [],
      editFlag: false,
      showFlag: 'none',
      account: [],
      dataRecevied: false,
      sku: '',
      option: '',
      product_line: '',
      product_category: '',
      product_description: '',
      price: '',
      upc: '',
      policyValue: '',
      tierValue: '',
      skuValue: '',
      accountValue: '',
      internetDate: '',
      adDate: '',
      priceDate: '',
      policyDate: '',
      skufilter: '',
      optionfilter: '',
      skutype: '',
      derivativefilter: '',
      downloadData: [],
      backupData: []
    };
    this.columns = [
      {
        title: 'TimeStamp',
        dataIndex: 'created_date',
        key: 'created_date',
        width: 140,
        // ...this.getColumnSearchProps('Product #'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Edit By',
        dataIndex: 'user',
        key: 'user',
        width: 70,
        // ...this.getColumnSearchProps('Product #'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Product#',
        dataIndex: 'product',
        key: 'product',
        width: 70,
        // ...this.getColumnSearchProps('Product #'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Tier',
        dataIndex: 'tier',
        key: 'tier',
        width: 100,
        // ...this.getColumnSearchProps('Tier'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Product Category',
        dataIndex: 'product_category',
        key: 'product_category',
        // ...this.getColumnSearchProps('PL'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'SKU Type',
        dataIndex: 'sku_type',
        key: 'sku_type',
        // ...this.getColumnSearchProps('SKU Type'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Derivative List',
        dataIndex: 'derivative_list',
        key: 'derivative_list',
        // ...this.getColumnSearchProps('Derivative List'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Product Line',
        dataIndex: 'pl',
        key: 'pl',
        // ...this.getColumnSearchProps('PL'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Internet Ad Embargo Date',
        dataIndex: 'internet_ad_embargo_date',
        key: 'internet_ad_embargo_date',
        width: 80,
        // ...this.getColumnSearchProps('Internet Ad Embargo Date'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Ad Embargo Date',
        dataIndex: 'ad_embargo_date',
        key: 'ad_embargo_date',
        // ...this.getColumnSearchProps('Ad Embargo Date'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'MAP Price',
        dataIndex: 'map_price',
        key: 'map_price',
        // ...this.getColumnSearchProps('MAP Price'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Price Change Date',
        dataIndex: 'price_change_date',
        key: 'price_change_date',
        // ...this.getColumnSearchProps('Price Change Date'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Product Description',
        dataIndex: 'product_description',
        key: 'product_description',
        width: 150,
        // ...this.getColumnSearchProps('Product Description'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Action',
        dataIndex: 'status',
        key: 'status',
        width: 70,
        // ...this.getColumnSearchProps('Product Description'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      }
    ];
  }

  componentDidMount() {
    let dataPacket = [];
    // const dropdownData = ["CF512A", "CF513A", "CZ992A"];
    // const tier = ["Tier A","Tier B","Tier C","Tier D","Tier E"];
    const skuType = ["Mainstream", "Derivative"];
    const client = ["Aarons", "Amazon", "Apple", "Best Buy", "BJs", "Costco", "Micro Electronics", "Microsoft", "DH", "Essendant", "Frys", "HHO", "HSN", "Ingram", "New Age", "OD OMax", "QVX", "Sams", "SP Richards", "Staples", "Synnex", , "Target", "Tech Data", "Supplies Network", "Walmart"];
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN + '/capricing/api/history')
        .then(response => {
          if (response.status === 200) {
            response.data.map((data, i) => {
              dataPacket.push({
                key: i,
                product: data.product,
                tier: data.tier,
                policy: data.policy,
                sku_type: data.sku_type,
                derivative_list: JSON.parse(JSON.stringify(data.derivative_list)),
                pl: data.pl,
                internet_ad_embargo_date: data.internet_ad_embargo_date,
                ad_embargo_date: data.ad_embargo_date,
                map_price: data.map_price,
                price_change_date: data.price_change_date,
                product_description: data.product_description,
                off_map_date: data.off_map_date,
                product_category: data.product_category,
                option: data.option,
                status: data.status.split('')[0].toUpperCase() + data.status.substr(1),
                reason: data.reason,
                notes: data.notes,
                user: data.user,
                created_date: data.created_date,
              })
              this.setState({
                mapped: data.mapped
              })
            })
            this.setState({
              SKUType: skuType,
              updateData: dataPacket,
              downloadData: dataPacket,
              backupData: dataPacket,
              dataRecevied: true
            });
          }
        })
        .catch(function (error) {
          window.location.hash = "/";
        })
    })
  }

  Change = (dateString, dateFormat) => {
    //alert(dateString);
    this.setState({ dateEdit: dateFormat })
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "", flag: true });
  };

  logout = () => {
    // this.props.history.push('/');
    return new Promise((resolve, reject) => {
      axios.post(process.env.REACT_APP_DOMAIN + '/logout')
        .then(response => {
          if (response.status === 200) {
            this.props.history.push('/');
          }
        })
        .catch(function (error) {
          message.error('Server is down! Please try again later.');
        })
    })
  }


  save(form, key) {
    console.log(dateEditable);
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        newData[index].role = this.state.dateEdit;
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ data: newData, editingKey: "", flag: true });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  delete(key) {
    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      let indexVal = this.state.data.indexOf(item);
      newData.splice(indexVal, 1);
      console.log(item);
      console.log(this.state.data);
      this.setState({ data: newData, editingKey: "" });
    } else {
      // newData.push(row);
      this.setState({ data: newData, editingKey: "" });
    }

  }

  edit(key) {
    this.setState({ editingKey: key, flag: false, editFlag: true });
  }

  // check = (event) => {
  //   alert(event.target.id);
  // }

  // dateSelect = (date,dateString,id) =>{
  //   if(id === "internet_date"){
  //     this.setState({
  //         internetDate: dateString
  //     })
  //   }
  //   else if(id === "ad_date"){
  //     this.setState({
  //       adDate: dateString
  //   })
  //   }
  //   else if(id === "price_date"){
  //     this.setState({
  //       priceDate: dateString
  //     })
  //   }
  //   else if(id === "policy_date"){
  //     this.setState({
  //       policyDate: dateString
  //    })
  //   }
  // }

  multipleSelect = (selectedItems, event) => {
    this.setState({
      accountValue: selectedItems
    })
  }

  addNew = () => {
    this.setState({
      addSKU: true,
      sku: '',
      option: '',
      product_line: '',
      product_description: '',
      price: '',
      upc: '',
      policyValue: '',
      skuValue: '',
      tierValue: ''

    })
  }

  text = (event) => {
    if (event.target.id === "skufilter") {
      this.setState({
        skufilter: event.target.value
      })
    }
    else if (event.target.id === "optionfilter") {
      this.setState({
        optionfilter: event.target.value
      })
    }
    else if (event.target.id === "derivativefilter") {
      this.setState({
        derivativefilter: event.target.value
      })
    }
  }

  select = (value, id) => {
    if (id === "skutype") {
      this.setState({
        skutype: value
      })
    }
    else if (id === "productCategory") {
      this.setState({
        product_category: value,
      })
    }
  }

  refresh = () => {
    let data = this.state.backupData;
    this.setState({
      skufilter: '',
      updateData: data,
      optionfilter: '',
      derivativefilter: '',
      skutype: '',
      product_category: ''
    })
  }


filter = () => {
  let data = this.state.backupData;

  if(this.state.skufilter != ""){
    let arr1, skufilter = this.state.skufilter;
    
    arr1 = _.filter(data, function(option){
      if(option.product !=null && option.product !=""){
        return option["product"].toLowerCase().indexOf(skufilter.toLowerCase()) >-1;
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }
  if(this.state.optionfilter != ""){
    let arr1, optionfilter = this.state.optionfilter;
    
    arr1 = _.filter(data, function(option){
      if(option.pl !=null && option.pl !=""){
        return option["pl"].toLowerCase().indexOf(optionfilter.toLowerCase()) >-1;
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }
  if(this.state.product_category != ""  && this.state.product_category != undefined){
    let arr1, productCategory = this.state.product_category;
    
    arr1 = _.filter(data, function(option){
      if(option.product_category !=null && option.product_category !=""){
        return option["product_category"].toLowerCase().indexOf(productCategory.toLowerCase()) >-1;
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

 if(this.state.skutype != ""){
    let arr1, skutype = this.state.skutype;
    
    arr1 = _.filter(data, function(option){
      if(option.sku_type !=null && option.sku_type !=""){
        return option["sku_type"].toLowerCase().indexOf(skutype.toLowerCase()) >-1;
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if(this.state.derivativefilter != "" ){
    let arr1, derivativefilter = this.state.derivativefilter;
    
    arr1 = _.filter(data, function(option){
      if(option.derivative_list !=null && option.derivative_list !=""){
        return option["derivative_list"].toLowerCase().indexOf(derivativefilter.toLowerCase()) >-1;
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.skufilter != "" && this.state.optionfilter != "" ){
    let arr1,skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter;

    arr1 = _.filter(data, function(d){
      if(d.product != null && d.product != "" && d.pl != null && d.pl != "") {
        return d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.skufilter != "" && this.state.product_category != undefined && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.product != null && d.product != "" ) {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.skufilter != "" && this.state.skutype != "" && this.state.skutype != undefined){
    let arr1,skufilter1 =this.state.skufilter,skutype1 = this.state.skutype;

    arr1 = _.filter(data, function(d){
      if(d.product != null && d.product != "" && d.sku_type != null && d.sku_type != "") {
        return d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
          d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

   if (this.state.skufilter != "" && this.state.derivativefilter != ""){
    let arr1,skufilter1 =this.state.skufilter, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product != null && d.product != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.optionfilter != "" && this.state.product_category != undefined){
    let arr1, productCategory1 = this.state.product_category,optionfilter1 = this.state.optionfilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.pl != null && d.pl != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.optionfilter != "" && this.state.skutype != "" && this.state.skutype != undefined){
    let arr1,optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype;

    arr1 = _.filter(data, function(d){
      if( d.pl != null && d.pl != "" && d.sku_type != null && d.sku_type != "") {
        return d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.optionfilter != "" && this.state.derivativefilter != ""){
    let arr1,optionfilter1 = this.state.optionfilter, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if( d.pl != null && d.pl != "" && d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

   if(this.state.product_category != "" && this.state.skutype != "" && this.state.product_category != undefined){
    let arr1, productCategory1 = this.state.product_category, skutype1 = this.state.skutype;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.sku_type != null && d.sku_type != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1
       }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.derivativefilter != "" && this.state.product_category != undefined){
    let arr1, productCategory1 = this.state.product_category, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
               d["derivative_list"].toString().toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.skutype != "" && this.state.derivativefilter != "" && this.state.skutype != undefined){
    let arr1,skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.skufilter != "" && this.state.optionfilter != ""  && this.state.product_category != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.product != null && d.product != "" && d.pl != null && d.pl != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.skufilter != "" && this.state.optionfilter != "" && this.state.skutype != "" && this.state.skutype != undefined){
    let arr1, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype;

    arr1 = _.filter(data, function(d){
      if(d.product != null && d.product != "" && d.pl != null && d.pl != "" && d.sku_type != null && d.sku_type != "") {
        return d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.skufilter != "" && this.state.optionfilter != "" && this.state.derivativefilter != ""){
    let arr1,skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product != null && d.product != "" && d.pl != null && d.pl != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.skufilter != ""  && this.state.skutype != "" && this.state.product_category != undefined && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, skutype1 = this.state.skutype;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.product != null && d.product != ""  && d.sku_type != null && d.sku_type != "" ) {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }


  if (this.state.product_category != "" && this.state.skufilter != ""   && this.state.derivativefilter != "" && this.state.product_category != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter,derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.product != null && d.product != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.skufilter != "" && this.state.skutype != "" && this.state.derivativefilter != "" && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if( d.product != null && d.product != "" && d.pl != null && d.pl != ""
      && d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return  d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" &&  this.state.optionfilter != "" && this.state.skutype != "" && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.pl != null && d.pl != ""&& d.sku_type != null && d.sku_type != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.optionfilter != "" && this.state.derivativefilter != "" && this.state.product_category != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" &&  d.pl != null && d.pl != "" &&  d.derivative_list != null && d.derivative_list != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.optionfilter != "" && this.state.skutype != "" && this.state.derivativefilter != "" && this.state.product_category != undefined && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.pl != null && d.pl != "" && d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.skutype != "" && this.state.derivativefilter != "" && this.state.product_category != undefined && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != ""&& d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" &&  this.state.optionfilter != "" && this.state.skutype != "" && this.state.derivativefilter != "" && this.state.product_category != undefined && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.pl != null && d.pl != ""
      && d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.skufilter != "" && this.state.skutype != "" && this.state.derivativefilter != "" && this.state.product_category != undefined && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.product != null && d.product != "" && d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.skufilter != "" && this.state.optionfilter != "" && this.state.skutype != "" && this.state.derivativefilter != "" && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product != null && d.product != "" && d.pl != null && d.pl != ""
      && d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }


  if (this.state.product_category != "" && this.state.skufilter != "" && this.state.optionfilter != "" && this.state.derivativefilter != "" && this.state.product_category != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.product != null && d.product != "" && d.pl != null && d.pl != ""&& d.derivative_list != null && d.derivative_list != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }

  if (this.state.product_category != "" && this.state.skufilter != "" && this.state.optionfilter != "" && this.state.skutype != "" && this.state.product_category != undefined && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.product != null && d.product != "" && d.pl != null && d.pl != ""
      && d.sku_type != null && d.sku_type != "" ) {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }


  if (this.state.product_category != "" && this.state.skufilter != "" && this.state.optionfilter != "" && this.state.skutype != "" && this.state.derivativefilter != "" && this.state.product_category != undefined && this.state.skutype != undefined){
    let arr1, productCategory1 = this.state.product_category, skufilter1 =this.state.skufilter, optionfilter1 = this.state.optionfilter, skutype1 = this.state.skutype, derivativefilter1 =this.state.derivativefilter;

    arr1 = _.filter(data, function(d){
      if(d.product_category != null && d.product_category != "" && d.product != null && d.product != "" && d.pl != null && d.pl != ""
      && d.sku_type != null && d.sku_type != "" && d.derivative_list != null && d.derivative_list != "") {
        return d["product_category"].toString().toLowerCase().indexOf(productCategory1.toLocaleLowerCase()) > -1 &&
        d["product"].toLowerCase().indexOf(skufilter1.toLowerCase()) > -1 &&
        d["pl"].toLowerCase().indexOf(optionfilter1.toLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(skutype1.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toLowerCase().indexOf(derivativefilter1.toLowerCase()) > -1
      }
    });
    this.setState({
      updateData:arr1,
      downloadData:arr1
    })
  }
}

  handleOk = () => {
    console.log(this.state);
    window.location.reload();
    this.setState({
      addSKU: false,
      visible: false
    })
  }

  handleCancel = () => {
    window.location.reload();
    this.setState({
      visible: false,
      addSKU: false
    })
  }

  render() {
    let policyDate, SkuData, tierData, multiData = [];
    if (this.state.dataRecevied) {
      policyDate = this.state.policy;
      SkuData = this.state.SKUType;
      tierData = this.state.Tier;
      multiData = this.state.account;
    }
    let rowIndex = (recordData) => {
      record = recordData;
      // console.log(record);
      this.setState({
        visible: true,
        price: record.Seller_Advertised_Price
      })
    }

    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === "role" ? "date" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });


    return (this.state.dataRecevied === true ? (
      <div>
        <div style={{ marginLeft: "-3.3em" }}>
          <Row style={{ marginTop: "1em" }}>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={3}>
                <label className="title">SKU History Filter</label>
              </Col>
              <Col span={17}></Col>
              {/* <Col span={2}><a href="#" onClick={this.addNew} title="Click here to add new SKU">Add New SKU</a></Col> */}
            </Col>
          </Row>
          <Row style={{ marginTop: "1.5em" }}>
            <Col span={23}>
              <Col span={22}>
                <Col span={1}></Col>
                <Col span={1}><label className="title1">SKU</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em" }} allowClear id="skufilter" onChange={this.text} value={this.state.skufilter} /></Col>

                <Col span={1}><label style={{ marginLeft: "2em" }} className="title1">PL</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em", marginLeft: "0.2em" }} allowClear id="optionfilter" onChange={this.text} value={this.state.optionfilter}></Input></Col>

                <Col span={4}><label className="title1" style={{ marginLeft: "1.5em" }}>Product Category</label></Col>
                <Col span={2} style={{ marginTop: "-0.5em", marginLeft: "-4.5em" }}>< DropdownProduct placeholder={"Select Product Category..."} select={this.select} value={this.state.product_category} id="productCategory" /></Col>

                <Col span={1}></Col>
                <Col span={2}><label className="title1">SKU Type</label></Col>
                <Col span={2} style={{ marginTop: "-0.5em", marginLeft: "-1em" }}><Dropdown allowClear data={dropdownData} placeholder={"Select SKU Type..."} id="skutype" value={this.state.skutype} select={this.select} /></Col>
                <Col span={1}></Col>
                <Col span={2}><label className="title1">Derivative Reseller</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em" }} allowClear id="derivativefilter" onChange={this.text} value={this.state.derivativefilter}></Input></Col>
              </Col>
              <Col span={1}><Button type="primary" onClick={this.filter} style={{ marginTop: "-1em", marginLeft: "-8em" }} icon="search">Search</Button></Col>
            </Col>
            <Col span={1}></Col>
            <Col span={2} style={{ marginLeft: "-12em" }}><Tooltip placement="right" title="Refresh"><span style={{ color: "#0095d9", fontSize: "16px", cursor: "pointer" }} onClick={this.refresh}>Clear All</span></Tooltip></Col>
          </Row>
          <Row>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={22}><Divider /></Col>
              <Col span={2}></Col>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ marginTop: "-1em" }}>
              <Col span={1}></Col>
              <Col span={4}><span className="title1">SKU History Report</span></Col>
              <Col span={19}></Col>
            </Col>
          </Row>
        </div>
        <div style={{ margin: "3em", marginTop: "0.5em", backgroundColor: "#fff" }}>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              bordered
              dataSource={this.state.updateData}
              columns={columns}
              rowClassName="editable-row"
              pagination={{
                pageSize: 15
              }}
              style={{ marginLeft: "-3em" }}
              onRow={(record) => ({ onClick: () => { rowIndex(record); } })}
            />
          </EditableContext.Provider>
        </div>
      </div>
    ) : (<Loading status={this.state.dataRecevied} />)

    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
