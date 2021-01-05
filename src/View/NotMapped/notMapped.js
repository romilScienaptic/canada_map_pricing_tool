import React from "react";
import "./notmapped.css";
import "antd/dist/antd.css";
import { Table, Input, Col, Popconfirm, Form, Button, Icon, Row, Modal, Divider, DatePicker, Tooltip, InputNumber, message, Select } from "antd";
// import jsonData from "../../Notmapped.json";
import axios from "axios";
import Tab from "../../Components/Tab/Tab";
import Dropdown from '../../Components/Select/select';
import Download from '../../Components/Download/csvDownload';
import DropdownProduct from '../../Components/DropdownProduct/DropdownPro';
import Datepicker from '../../Components/Datepicker/datepicker';
import MultipleSelect from '../../Components/MultiSelect/multiSelect';
import MissingField from '../../Components/Validation/missingField';
import Hp from '../../assets/images/Hp.png'

import moment from 'moment';
const ButtonGroup = Button.Group;
const dropdownData = ["Mainstream", "Derivative"];
const EditableContext = React.createContext();
const dateFormat = 'MM/DD/YYYY';

let dateEditable, recordData = [];
let flagSkuType = false, flagOption = false, flagsku = false, flagDerivative = false, flagCompo = false;
const { Option } = Select;

class EditableCell extends React.Component {

  constructor(props){
    super(props);
    this.state={
      option:[]
    }
  }

  componentDidMount(){
    const filteredOptions = ["Aarons", "Amazon", "Staples", "Apple", "Best Buy", "Costco", "Micro Electronics", "Microsoft", "DH", "Essendant", "Frys", "HHO", "HSN", "Ingram", "New Age", "OD OMax", "QVX", "Sams", "SP Richards", "Synnex", , "Target", "Tech Data", "Supplies Network", "Walmart","Samsung Contractual Print Specialists ONLY"];
    this.setState({
      option:filteredOptions
    })
  }

  getInput = () => {
    if (this.props.dataIndex === "internet_ad_embargo_date" ||
      this.props.dataIndex === "ad_embargo_date" ||
      this.props.dataIndex === "price_change_date") {
      return <DatePicker id={this.props.dataIndex}
        defaultValue={(moment(), 'MM/DD/YYYY')} onChange={this.Change} format={'MM/DD/YYYY'}/>
    }
    else if (this.props.dataIndex === "sku_type") {
      return <Select defaultValue={this.props.record.sku_type} style={{ width: 120 }}>
        <Option value="Mainstream">Mainstream</Option>
        <Option value="Derivative">Derivative</Option>
      </Select>
    }
    else if (this.props.dataIndex === "derivative_list") {
      if(typeof(this.props.record.derivative_list) === "string"){
        let temp = [];
        return <Select placeholder={"Select Account"} defaultValue={temp} style={{ width: 120 }} mode="multiple">
        {this.state.option.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      }
      else{
        return <Select placeholder={"Select Account"} defaultValue={this.props.record.derivative_list} style={{ width: 120 }} mode="multiple">
        {this.state.option.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      }
    }
    else
      return <Input allowClear/>;
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
                  required: false,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: (dataIndex === "internet_ad_embargo_date" || dataIndex === "ad_embargo_date" || dataIndex === "price_change_date") ? (moment(record[dataIndex], 'MM/DD/YYYY')) : record[dataIndex],
              // initialValue: moment(record[dataIndex])
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
      editingKey: "",
      flag: true,
      dateEdit: '',
      visible: false,
      closable: false,
      addSKU: false,
      html: [],
      modalButton1: '',
      modalButton2: '',
      editFlag: false,
      showFlag: 'none',
      account: [],
      dataRecevied: false,
      sku: '',
      option: '',
      product_line: '',
      product_description: '',
      derivative_list: '',
      price: '',
      upc: '',
      policyValue: '',
      tierValue: '',
      skuValue: '',
      accountValue: [],
      productCategory:'',
      product_category:'',
      internetDate: '',
      adDate: '',
      priceDate: '',
      policyDate: '',
      ad_date: '',
      embargo_date: '',
      backupData: [],
      skufilter: '',
      optionfilter: '',
      derivativefilter: '',
      downloadData: [],
      downloadFolderName:'Not-mapped-sku-filter.csv',
      filterSku: '',
      mapped: '',
      upc: '',
      void_record: ["No"],
      border: '1px solid #d9d9d9',
      borderRadius: '0',
      missingMessage:'',
      show:false
    };
    this.columns = [
      {
        title: "",
        dataIndex: "operation",
        width: "10%",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    href="javascript:;"
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    <Icon type="save" theme="filled" />
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <span style={{ marginLeft: "1em" }}></span>
              <Popconfirm
                title="Sure to cancel?"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                onConfirm={() => this.cancel(record.key)}
              >
                <a><Icon type="close-circle" theme="filled" />Cancel</a>
              </Popconfirm>
            </span>
          ) : (
              <div>
                <a
                  disabled={editingKey !== ""}
                  onClick={() => this.edit(record.key)}
                ><Icon type="edit" theme="filled" />
                  Edit
              </a>
                <span style={{ marginLeft: "2em" }}></span>
                <Popconfirm
                  title="Sure to Delete?"
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  onConfirm={() => this.delete(record.key)}
                >
                  <a
                  // onClick={() => this.delete(record.key)}
                  ><Icon type="close-circle" theme="filled" />
                    Delete
              </a>
                </Popconfirm>
              </div>
            );
        }
      },
      {
        title: 'Product#',
        dataIndex: 'product',
        key: 'product',
        width: 70,
        // editable: true,
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      // {
      //   title: 'Tier',
      //   dataIndex: 'tier',
      //   key: 'tier',
      //   width: 100,
      //   // editable: true,
      //   render: text =><label style={{cursor:"pointer"}}>{text}</label>
      // },
      // {
      //   title: 'Policy',
      //   dataIndex: 'policy',
      //   key: 'policy',
      //   // editable: true,
      //   render: text =><label style={{cursor:"pointer"}}>{text}</label>
      // },
      {
        title: 'SKU Type',
        dataIndex: 'sku_type',
        key: 'sku_type',
        editable: true,
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Derivative List',
        dataIndex: 'derivative_list',
        key: 'derivative_list',
        editable: true,
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Product Line',
        dataIndex: 'pl',
        key: 'pl',
        editable: true,
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Internet Ad Embargo Date',
        dataIndex: 'internet_ad_embargo_date',
        key: 'internet_ad_embargo_date',
        width: 150,
        editable: true,
        inputType: "date",
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Ad Embargo Date',
        dataIndex: 'ad_embargo_date',
        key: 'ad_embargo_date',
        editable: true,
        width: 120,
        inputType: "date",
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'MAP Price',
        dataIndex: 'map_price',
        key: 'map_price',
        width: 80,
        editable: true,
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Price Change Date',
        dataIndex: 'price_change_date',
        key: 'price_change_date',
        editable: true,
        width: 130,
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Product Description',
        dataIndex: 'product_description',
        key: 'product_description',
        width: 170,
        editable: true,
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      }
    ];
  }

  componentDidMount() {
    let dataPacket = [];
    // const dropdownData = ["CF512A", "CF513A", "CZ992A"];
    // const tier = ["Tier A", "Tier B", "Tier C", "Tier D", "Tier E"];
    const policy = ["MAP"];
    const tier = ["Tier D (Supplies)"];
    const skuType = ["Mainstream", "Derivative"];
    // const client = ["Aarons", "Amazon", "Apple", "Best Buy", "BJs", "Costco", "Micro Electronics", "Microsoft", "DH", "Essendant", "Frys", "HHO", "HSN", "Ingram", "New Age", "OD OMax", "QVX", "Sams", "SP Richards", "Staples", "Synnex", , "Target", "Tech Data", "Supplies Network", "Walmart"];
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN+'/capricing/api/notMapped')
        .then(response => {
          if (response.status === 200) {
            response.data.map((data, i) => {
              dataPacket.push({
                key: i,
                product: data.product,
                tier: data.tier,
                policy: data.policy,
                sku_type: data.sku_type,
                // derivative_list: JSON.parse(JSON.stringify(data.derivative_list)),
                derivative_list: data.derivative_list.toString(),
                pl: data.pl,
                internet_ad_embargo_date: data.internet_ad_embargo_date,
                ad_embargo_date: data.ad_embargo_date,
                map_price: data.map_price,
                price_change_date: data.price_change_date,
                product_description: data.product_description,
                off_map_date: data.off_map_date,
                product_category: data.product_category,
                option: data.option
              })
              this.setState({
                mapped: data.mapped
              })
            })
            this.setState({
              data: dataPacket,
              downloadData: dataPacket,
              Tier: tier,
              policy: dropdownData,
              SKUType: skuType,
              backupData: dataPacket,
              policy: policy,
              dataRecevied: true
            }, () => this.DerivativeList());
          }
        })
        .catch(function (error) {
          window.location.hash = "/";
        })
    })
    // let updatedDownloadData = dataPacket;
    //     if(updatedDownloadData.length !== 0){
    //       updatedDownloadData.map((key) =>{
    //         delete key.key
    //       })
    // }
  }

  DerivativeList = () =>{
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN+'/capricing/api/getDerivativeList')
          .then(response => {
              if (response.status === 200) {
                this.setState({
                  account:response.data,
                });
              }
          })
          .catch(function (error) {
              window.location.hash="/";
          })
    })
  }

  Change = (dateString, dateFormat) => {
    // alert(dateString);
    this.setState({ dateEdit: dateFormat })
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "", flag: true, show:false });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      let mnths = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
      };
      let product_sku = "";
      let internet_ad_embargo_date = row.internet_ad_embargo_date._d.toString().split(" ");
      let ad_embargo_date = row.ad_embargo_date._d.toString().split(" ");
      let price_change_date = row.price_change_date._d.toString().split(" ");
      row.internet_ad_embargo_date = [mnths[internet_ad_embargo_date[1]], internet_ad_embargo_date[2], internet_ad_embargo_date[3]].join("/");
      row.ad_embargo_date = [mnths[ad_embargo_date[1]], ad_embargo_date[2], ad_embargo_date[3]].join("/");
      row.price_change_date = [mnths[price_change_date[1]], price_change_date[2], price_change_date[3]].join("/");
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        newData[index].role = this.state.dateEdit;
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        // this.setState({  });
        if (recordData.option.length !== 0) {
          product_sku = recordData.product + '#' + recordData.option;
        }
        else {
          product_sku = recordData.product;
        }
        let derivative;
        if (typeof (row.derivative_list) === "string") {
          derivative = [];
          derivative.push(row.derivative_list)
        }
        else {
          derivative = row.derivative_list;
        }

        if (row.sku_type === "Mainstream" && row.derivative_list.length !== 0){
          this.setState({
            show: true,
            missingMessage: " ** An account can be associated only with SKU Type as 'Derivative'."
          })
        }
        else if (row.sku_type === "Derivative" && row.derivative_list.length === 0){
          this.setState({
            show: true,
            missingMessage: " ** For SKU Type as 'Derivative'. Please add an account(s)."
          })
        }
        else{
          return new Promise((resolve, reject) => {
            axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/addAndUpdate',
              {
                "tier": recordData.tier,
                "sku_type": row.sku_type,
                "derivative_list": derivative,
                "pl": row.pl,
                "product": product_sku,
                "product_description": row.product_description,
                "internet_ad_embargo_date": row.internet_ad_embargo_date,
                "ad_embargo_date": row.ad_embargo_date,
                "map_price": row.map_price,
                "price_change_date": row.price_change_date,
                "new_map_price": row.map_price,
                "off_map_date": recordData.off_map_date,
                "policy": recordData.policy,
                "product_category": recordData.product_category,
                "void_record": ["No"],
                "upc": "",
                "option": recordData.option,
                "mapped": this.state.mapped
              })
              .then(response => {
                if (response.status === 200) {
                  this.setState({
                    data: newData,
                    editingKey: "",
                    show:false,
                    flag: true
                  })
                }
              })
              .catch(function (error) {
                message.error('Server is Down. Please try Later!');
              })
          })
        }

      }

      else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  delete(key) {
    let product_sku = "";
    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      let indexVal = this.state.data.indexOf(item);
      newData.splice(indexVal, 1);
      // console.log(item);
      // console.log(this.state.data);
      if (recordData.option.length !== 0) {
        product_sku = item.product + '#' + recordData.option;
      }
      else {
        product_sku = item.product;
      }
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/addAndUpdate',
          {
            "tier": recordData.tier,
            "sku_type": item.sku_type,
            "derivative_list": item.derivative_list.split(', '),
            "pl": item.pl,
            "product": product_sku,
            "product_description": item.product_description,
            "internet_ad_embargo_date": item.internet_ad_embargo_date,
            "ad_embargo_date": item.ad_embargo_date,
            "map_price": item.map_price,
            "price_change_date": item.price_change_date,
            "new_map_price": item.map_price,
            "off_map_date": recordData.off_map_date,
            "policy": recordData.policy,
            "product_category": recordData.product_category,
            "void_record": ["Yes"],
            "upc": "",
            "option": recordData.option,
            "mapped": this.state.mapped
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({
                data: newData,
                editingKey: ""
              }, () => this.componentDidMount())
            }
          })
          .catch(function (error) {
            message.error('Server is Down. Please try Later!');
          })
      })
      // this.setState({ data: newData, editingKey: "" });
    } else {
      // newData.push(row);
      this.setState({ data: newData, editingKey: "" });
    }

  }

  edit(key) {
    this.setState({ editingKey: key, flag: true, editFlag: true });
  }

  check = (event) => {
    alert(event.target.id);
  }

  select = (value, id) => {
    if (id === "Sku_type") {
      if (value === "Derivative") {
        this.setState({
          showFlag: 'block',
          skuValue: value
        })
      }
      else {
        this.setState({
          showFlag: 'none',
          skuValue: value
        })
      }
    }
    else if (id === "policy") {
      this.setState({
        policyValue: value
      })
    }
    else if (id === "trier") {
      this.setState({
        tierValue: value
      })
    }
    else if (id === "filterSku") {
      this.setState({
        filterSku: value
      })
    }
    else if(id === "productCategory"){
      this.setState({
        product_category:value,
      })
    }
  }

  dateSelect = (date, dateString, id) => {
    if (id === "internet_date") {
      this.setState({
        internetDate: dateString
      })
    }
    else if (id === "ad_date") {
      this.setState({
        adDate: dateString
      })
    }
    else if (id === "price_date") {
      this.setState({
        priceDate: dateString
      })
    }
    else if (id === "policy_date") {
      this.setState({
        policyDate: dateString
      })
    }
  }

  inputNumberAdd = (value) => {
    this.setState({
      price1: value
    })
  }

  text = (event) => {
    if (event.target.id === 'SKU') {
      this.setState({
        sku: event.target.value
      })
    }
    else if (event.target.id === "option") {
      this.setState({
        option: event.target.value
      })
    }
    else if (event.target.id === "product_line") {
      this.setState({
        product_line: event.target.value
      })
    }
    else if (event.target.id === "product_description") {
      this.setState({
        product_description: event.target.value
      })
    }
    else if (event.target.id === "price") {
      this.setState({
        price: event.target.value
      })
    }
    else if (event.target.id === "upc") {
      this.setState({
        upc: event.target.value
      })
    }
  }

  multipleSelect = (selectedItems, event) => {
    this.setState({
      accountValue: selectedItems
    })
  }

  pickDate = (date, dateString, id) => {
    if (id === "embargo_date") {
      this.setState({
        embargo_date: dateString
      })
    }
    else if (id === "ad_date") {
      this.setState({
        ad_date: dateString
      })
    }
  }

  refresh = () => {
    let refreshData = this.state.backupData;
    this.setState({
      skufilter: '',
      data: refreshData,
      optionfilter: '',
      derivativefilter: '',
      product_category:'',
      filterSku: ''
    })
  }

  filter = () => {
    let data = this.state.backupData;
    let updatedDownloadData = [];
    if (this.state.skufilter != "" || this.state.optionfilter != "" || this.state.filterSku != "" || this.state.derivativefilter != "" || this.state.product_category !="") {
       const arr1 = data.filter(d =>
        d["pl"].toString().toLowerCase().indexOf(this.state.optionfilter.toLocaleLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(this.state.filterSku.toLocaleLowerCase()) > -1 &&
        d["product"].toString().toLowerCase().indexOf(this.state.skufilter.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.derivativefilter.toLocaleLowerCase()) > -1 &&
        d["product_category"].toString().toLowerCase().indexOf(this.state.product_category.toLocaleLowerCase()) > -1
      );
      updatedDownloadData = arr1;
      if (updatedDownloadData.length !== 0) {
        if (updatedDownloadData[0].key !== undefined)
          delete updatedDownloadData[0].key;
      }
      this.setState({
        data: arr1,
        downloadData: updatedDownloadData
      })
    }

  }

  inputText = (event) => {
    if (event.target.id === "sku") {
      this.setState({
        sku: event.target.value
      })
    }
    else if (event.target.id === "option") {
      this.setState({
        option: event.target.value
      })
    }
    else if (event.target.id === "product_line") {
      this.setState({
        product_line: event.target.value
      })
    }
    else if (event.target.id === "product_description") {
      this.setState({
        product_description: event.target.value
      })
    }
    else if (event.target.id === "derivative_list") {
      this.setState({
        derivative_list: event.target.value
      })
    }
    else if (event.target.id === "skufilter") {
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

  open = () => {
    let template = [];
    template.push(
      <div style={{ overflow: "auto" }}>
        <Col span={24}>
          <Col span={1}></Col>
          <Col span={10}>
            <label className="title1">Product#</label>
            <Input id="sku" onChange={this.inputText}></Input>
          </Col>
          <Col span={1}></Col>
          <Col span={10}>
            <label className="title1">Product Line</label>
            <Input id="product_line" onChange={this.inputText}></Input>
          </Col>
        </Col><br /><br /><br />
        <Col span={24}>
          <Col span={1}></Col>
          <Col span={10}>
            <label className="title1">Product Description</label>
            <Input id="product_description" onChange={this.inputText}></Input>
          </Col>
          <Col span={1}></Col>
          <Col span={10}>

          </Col>
        </Col><br /><br /><br />
        <Col span={24}>
          <Col span={1}></Col>
          ` <Col span={10}>
            <label className="title1">Internet Embargo Ad Date</label>
            <Datepicker id="embargo_date" defaultVal={false} width={230} action={this.pickDate} value={this.state.embargo_date} />
            {/* <Datepicker action={this.pickDate} defaultVal={false} placeholder="Select Date" id={"embargo_date"} value={this.state.embargo_date} /> */}
          </Col>
          <Col span={1}></Col>
          <Col span={10}>
            <label className="title1">Ad Embargo Date</label>
            <Datepicker id="ad_date" defaultVal={false} width={230} action={this.pickDate} placeholder="Select Date" value={this.state.ad_date} />
          </Col>
        </Col><br /><br /><br /><br />
        <Col span={24} style={{ marginTop: "-1.5em" }}>
          <Col span={1}></Col>
          ` <Col span={10}>
            <label className="title1">Derivative List</label>
            <Input id="derivative_list" onChange={this.inputText} />
          </Col>
        </Col>
      </div>
    )
    this.setState({
      visible: true,
      showFlag: 'none',
      html: template[0],
      modalButton1: 'Add',
      modalButton2: 'Cancel',
      sku: '',
      option: '',
      product_line: '',
      product_description: '',
      embargo_date: '',
      ad_date: '',
      derivative_list: '',
      closable: false
    })
  }

  // add = () => {
  //   let list = [];
  //   let oldData = this.state.data;
  //   let i = oldData.length;
  //   let d = new Date();
  //   let dd = d.getDate();
  //   let mm = d.getMonth() + 1;
  //   let yy = d.getFullYear();
  //   let min = d.getMinutes();
  //   let hh = d.getHours();
  //   let ss = d.getSeconds();
  //   if (ss.toString().length < 2)
  //     ss = '0' + ss;
  //   let zone;
  //   if (hh > 12)
  //     zone = 'PM'
  //   else
  //     zone = 'AM'
  //   let date = mm + '/' + dd + '/' + yy + '\n';
  //   // date = yy + '/' + mm + '/' + dd;
  //   //  hh + ':'+min+':'+ss+' '+zone;
  //   list.push({
  //     key: i++,
  //     SKU: 'ZBY'+i+'UA',
  //     option: 'ABA',
  //     product_line: 'Ink',
  //     product_description:"KV",
  //     embargo_date:"03/05/2019",
  //     ad_date:"06/05/2019",
  //     derivative_list: 'Microsoft' +i
  //   })

  //   this.setState({ data: oldData.concat(list) });
  // }

  submit = () => {
    let oldData = this.state.data;
    let newData = [], i = oldData.length;
    let embargo_date = moment().format('MM/DD/YYYY');
    let ad_date = moment().format('MM/DD/YYYY');
    if (this.state.embargo_date === "" || this.state.ad_date === "") {
      newData.push({
        key: i++,
        SKU: this.state.sku,
        option: this.state.option,
        product_line: this.state.product_line,
        product_description: this.state.product_description,
        embargo_date: embargo_date,
        ad_date: ad_date,
        derivative_list: this.state.derivative_list
      })
    }
    else {
      newData.push({
        key: i++,
        SKU: this.state.sku,
        option: this.state.option,
        product_line: this.state.product_line,
        product_description: this.state.product_description,
        embargo_date: this.state.embargo_date,
        ad_date: this.state.ad_date,
        derivative_list: this.state.derivative_list
      })
    }

    this.setState({
      data: oldData.concat(newData),
      visible: false,
      sku: false,
      option: '',
      product_line: '',
      product_description: '',
      derivative_list: '',
      account:[]
    })
  }

  handleOk = () => {
    // console.log(this.state);
    let data = this.state.updateData;
    let internetDate = moment().format('MM/DD/YYYY');
    let adDate = moment().format('MM/DD/YYYY');
    let priceDate = moment().format('MM/DD/YYYY');
    let policyDate = moment().format('MM/DD/YYYY');
    if (this.state.policyValue === "" || this.state.skuValue === ""
      || this.state.tierValue === "" || this.state.price1 === "" || this.state.sku === ""
      || this.state.internet_ad_embargo_date === "" || this.state.ad_embargo_date === "" ||
      this.state.priceDate === "") {
      this.setState({
        addSKU: true,
        show: true,
        border: "1px solid red",
        borderRadius: '2px'
      })
    }
    else {
      this.setState({
        border: "",
        borderRadius: ""
      })
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/addAndUpdate',
          {
            "tier": this.state.tierValue,
            "sku_type": this.state.skuValue,
            "derivative_list": this.state.accountValue,
            "pl": this.state.product_line,
            "product": this.state.sku,
            "product_description": this.state.product_description,
            "internet_ad_embargo_date": this.state.internetDate,
            "ad_embargo_date": this.state.adDate,
            "map_price": this.state.price1,
            "price_change_date": this.state.priceDate,
            "new_map_price": this.state.price1,
            "off_map_date": this.state.policyDate,
            "policy": this.state.policyValue,
            "product_category": this.state.product_category,
            "void_record": ["No"],
            "upc": this.state.upc1,
            "mapped": "false"
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({
                visible: false,
                policyValue: '',
                skuValue: '',
                tierValue: '',
                sku: '',
                price: '',
                price1: '',
                option: '',
                product_line: '',
                product_description: '',
                price: '',
                upc: '',
                upc1: '',
                internetDate: '',
                adDate: '',
                priceDate: '',
                policyDate: '',
                accountValue: [],
                show: false
              }, () => this.componentDidMount())
            }
          })
          .catch(function (error) {
            message.error('Server is Down. Please try Later!');
          })
      })
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      policyValue: '',
      accountValue: [],
      skuValue: '',
      tierValue: '',
      sku: '',
      price: '',
      price1: '',
      option: '',
      product_line: '',
      product_description: '',
      price: '',
      upc: '',
      upc1: '',
      internetDate: '',
      adDate: '',
      priceDate: '',
      policyDate: '',
      border: '',
      show: false
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
    let rowIndex = (record) => {
      recordData = record;
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


    return (
      <div>
        <div style={{marginLeft:"-3em" }}>
          <Row style={{ marginTop: "1.5em"}}>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={3}>
                <label className="title">SKU History Filter</label>
              </Col>
              <Col span={18}></Col>
              <Col span={2}><Button type="primary" onClick={this.open}>Add</Button></Col>
            </Col>
          </Row>
          <Row style={{ marginTop: "1.5em" }}>
            <Col span={23}>
              <Col span={22}>
                <Col span={1}></Col>
                <Col span={1}><label className="title1">SKU</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em", marginLeft: "-0.8em"  }} allowClear onChange={this.inputText} id="skufilter" value={this.state.skufilter}></Input></Col>
                
                <Col span={1}><label className="title1" style={{ marginLeft: "1.5em" }}>PL</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em", marginLeft: "-0.5em", width: "112%" }} allowClear onChange={this.inputText} id="optionfilter" value={this.state.optionfilter}></Input></Col>
                
                <Col span={4}><label className="title1" style={{ marginLeft: "2em" }}>Product Category</label></Col>
                <Col span={2} style={{ marginTop: "-0.5em", marginLeft: "-3.5em" }}>< DropdownProduct placeholder={"Select Product Category..."} select={this.select} value={this.state.product_category} id="productCategory" /></Col>

                <Col span={1}></Col>
                <Col span={2}><label className="title1">SKU Type</label></Col>
                <Col span={2} style={{ marginTop: "-0.5em", marginLeft: "-1em" }}><Dropdown data={dropdownData} placeholder={"Select SKU Type..."} id="filterSku" select={this.select} value={this.state.filterSku} /></Col>
                <Col span={1}></Col>
                <Col span={2}><label className="title1">Derivative Reseller</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em" }} onChange={this.inputText} allowClear id="derivativefilter" value={this.state.derivativefilter}></Input></Col>
              </Col>
              <Col span={1}><Button type="primary" onClick={this.filter} style={{ marginTop: "-1em" , marginLeft:"-7em"}} icon="search">Search</Button></Col>
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
            <Col span={24} style={{ marginTop: '-1em' }}>
              <Col span={1}></Col>
              <Col span={4}><label className="title1">Not Mapped Report</label></Col>
              <Col span={16}></Col>
              <Col span={3} style={{ marginTop: "-0.3em" }}><Download downloadFolderName={this.state.downloadFolderName} data={this.state.downloadData} /></Col>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={22} style={{ marginTop: "1em" }}><MissingField show={this.state.show} message={this.state.missingMessage} /></Col>
            </Col>
          </Row>
          <Modal
            closable={this.state.closable}
            visible={this.state.visible}
            style={{ top: 50 }}
            width={750}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Cancel
            </Button>,
              <Button key="submit" type="primary" onClick={this.handleOk}>
                Add
          </Button>
            ]}>
            <div style={{ overflow: "hidden" }}>
              <MissingField show={this.state.show}
                message={"** Policy, SKU Type, Tier, SKU, Internet Embargo Date, Ad Embargo Date and  Price Change Date are mandatory fields."} />
              <Col span={24} style={{ marginTop: "0.5em" }}>
                <label className="title2">Add a New SKU</label>
              </Col>
              <div style={{ marginTop: "3em" }}>
                <Col span={24}>
                  <Col span={5}><label className="title1">Policy<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown data={policyDate} placeholder="Select Policy" border={this.state.border} select={this.select} id="policy" value={this.state.policyValue} /></Col>
                  <Col span={1}></Col>
                  <Col span={5}><label className="title1">SKU Type<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown data={SkuData} placeholder="Select SKU Type" border={this.state.border} select={this.select} id="Sku_type" value={this.state.skuValue} /></Col>
                </Col>
                <br /><br />
                <Col span={24}>
                  <Col span={5}><label className="title1">Tier<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown data={tierData} placeholder="Select Tier" border={this.state.border} select={this.select} id="trier" value={this.state.tierValue} /></Col>
                  <Col span={1}></Col>
                  <Col span={13} style={{ display: this.state.showFlag }} >
                    <MultipleSelect dataOptions={multiData} placeholder={"Select Accounts..."} width={270} multipleSelect={this.multipleSelect} value={this.state.accountValue} />
                  </Col>
                  <Col span={5}><label className="title1">Product Category</label></Col>
                  <Col span={5}>< DropdownProduct  placeholder={"Select Product Category..."} select={this.select} value={this.state.product_category} id="productCategory" /></Col>
                </Col>
                <br /><br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">SKU<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%", border: this.state.border, borderRadius: this.state.borderRadius }} id="SKU" value={this.state.sku} /></Col>
                  <Col span={2}></Col>
                  {/* <Col span={4}><label className="title1">Option</label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%" }} id="option" value={this.state.option} /></Col> */}
                  <Col span={4}><label className="title1">Price<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><InputNumber allowClear step={1} onChange={this.inputNumberAdd} style={{ width: "105%", border: this.state.border }} id="Addprice" value={this.state.price1} /></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Product Line</label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%" }} id="product_line" value={this.state.product_line} /></Col>
                  <Col span={2}></Col>
                  <Col span={4}><label className="title1">Product Description</label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%" }} id="product_description" value={this.state.product_description} /></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4} style={{ marginTop: "-0.5em" }}><label className="title1"><span style={{ color: "red" }}>*</span>Internet Ad Embargo Date</label></Col>
                  <Col span={4}><Datepicker action={this.dateSelect} width={154} validate={this.state.border} borderRadius={this.state.borderRadius} id={"internet_date"} defaultVal={false} value={this.state.internetDate} defaultValue={this.state.internetDate} /></Col>
                  <Col span={3}></Col>
                  <Col span={4}><label className="title1"><span style={{ color: "red" }}>*</span>Ad Embargo Date</label></Col>
                  <Col span={4}><Datepicker action={this.dateSelect} width={154} validate={this.state.border} id={"ad_date"} borderRadius={this.state.borderRadius} defaultVal={false} value={this.state.adDate} defaultValue={this.state.adDate} /></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1"><span style={{ color: "red" }}>*</span>Price Change Date</label></Col>
                  <Col span={4}><Datepicker action={this.dateSelect} width={154} validate={this.state.border} id={"price_date"} borderRadius={this.state.borderRadius} defaultVal={false} value={this.state.priceDate} defaultValue={this.state.priceDate} /></Col>
                  {/* <Col span={3}></Col>
                  <Col span={4}><label className="title1">Off Policy Date</label></Col>
                  <Col span={4}><Datepicker action={this.dateSelect} width={154} id={"policy_date"} defaultVal={false} value={this.state.policyDate} defaultValue={this.state.policyDate} /></Col> */}
                </Col>
                <br /><br />
                {/* <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Price<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><InputNumber allowClear step={1} onChange={this.inputNumberAdd} style={{ width: "105%" }} id="Addprice" value={this.state.price1} /></Col>
                  <Col span={2}></Col>
                  <Col span={4}><label className="title1">UPC</label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%" }} id="upc" value={this.state.upc1} /></Col>
                </Col> */}
              </div>
            </div>
          </Modal>
          <Modal
            closable={this.state.closable}
            visible={this.state.visible1}
            width={600}
            cancel={this.handleCancel}
            submit={this.submit}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Cancel
            </Button>,
              <Button key="submit" type="primary" onClick={this.submit}>
                Add
            </Button>,
            ]}>
            <div style={{ overflow: "auto" }}>
              <Col span={24}>
                <Col span={1}></Col>
                <Col span={10}>
                  <label className="title1">SKU</label>
                  <Input id="sku" onChange={this.inputText} value={this.state.sku}></Input>
                </Col>
                <Col span={1}></Col>
                <Col span={10}>
                  <label className="title1">Product Line</label>
                  <Input id="product_line" onChange={this.inputText} value={this.state.product_line}></Input>
                </Col>
              </Col><br /><br /><br />
              <Col span={24}>
                <Col span={1}></Col>
                ` <Col span={10}>
                  <label className="title1">Internet Embargo Ad Date</label>
                  <Datepicker id="embargo_date" defaultVal={false} width={230} action={this.pickDate} value={this.state.embargo_date} defaultValue={this.state.embargo_date} />
                  {/* <Datepicker action={this.pickDate} defaultVal={false} placeholder="Select Date" id={"embargo_date"} value={this.state.embargo_date} /> */}
                </Col>
                <Col span={1}></Col>
                <Col span={10}>
                  <label className="title1">Ad Embargo Date</label>
                  <Datepicker id="ad_date" defaultVal={false} width={230} action={this.pickDate} placeholder="Select Date" value={this.state.ad_date} defaultValue={this.state.ad_date} />
                </Col>
              </Col><br /><br /><br /><br />
              <Col span={24} style={{ marginTop: "-1.2em" }}>
                <Col span={1}></Col>
                <Col span={10}>
                  <label className="title1">Product Description</label>
                  <Input id="product_description" onChange={this.inputText} value={this.state.product_description}></Input>
                </Col>
                <Col span={1}></Col>
                <Col span={10}>
                  <label className="title1">Derivative List</label>
                  {/* <Input id="derivative_list" onChange={this.inputText} value={this.state.derivative_list} /> */}
                  <MultipleSelect dataOptions={multiData} placeholder={"Select Accounts..."} width={270} multipleSelect={this.multipleSelect} />
                </Col>
              </Col><br /><br /><br />
              {/* <Col span={24}>
                <Col span={1}></Col>
                ` <Col span={10}>
                  <label className="title1">Internet Embargo Ad Date</label>
                  <Datepicker id="embargo_date" defaultVal={false} width={230} action={this.pickDate} value={this.state.embargo_date} defaultValue={this.state.embargo_date} />
                </Col>
                <Col span={1}></Col>
                <Col span={10}>
                  <label className="title1">Ad Embargo Date</label>
                  <Datepicker id="ad_date" defaultVal={false} width={230} action={this.pickDate} placeholder="Select Date" value={this.state.ad_date} defaultValue={this.state.ad_date} />
                </Col>
              </Col><br /><br /><br /><br /> */}
              {/* <Col span={24} style={{ marginTop: "-1.5em" }}>
                <Col span={1}></Col>
                ` <Col span={10}>
                  <label className="title1">Derivative List</label>
                  {/* <Input id="derivative_list" onChange={this.inputText} value={this.state.derivative_list} /> */}
              {/* <MultipleSelect dataOptions={multiData} placeholder={"Select Accounts..."} width={270} multipleSelect={this.multipleSelect} />
                </Col>
              </Col>  */}
            </div>
          </Modal>
        </div>
        <div style={{ margin: "3em", marginTop: "1em", backgroundColor: "#fff" }}>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              bordered
              dataSource={this.state.data}
              columns={columns}
              rowClassName="editable-row"
              pagination={{
                pageSize: 10
              }}
              style={{ marginLeft:"-3em" }}
              onRow={(record) => ({ onClick: () => { rowIndex(record); } })}
            />
          </EditableContext.Provider>
          {/* <ModalClass template={this.state.html} closable={this.state.closable} visible={this.state.visible} width={600} cancel={this.handleCancel} submit={this.submit} buttonValue1={this.state.modalButton1} buttonValue2={this.state.modalButton2} /> */}
        </div>
      </div>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
