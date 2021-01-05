import React from "react";
import "./home.css";
import "antd/dist/antd.css";
import Tab from "../../Components/Tab/Tab";
import { Table, Input, Col, Form, Button, Icon, Row, Modal, Tooltip, Divider, InputNumber, message } from "antd";
import Dropdown from '../../Components/Select/select';
import DropdownProduct from '../../Components/DropdownProduct/DropdownPro';
import Download from '../../Components/Download/csvDownload';
// import ModalClass from '../../Components/Modal/modal';
import MultipleSelect from '../../Components/MultiSelect/multiSelect';
import Datepicker from '../../Components/Datepicker/datepicker';
import axios from "axios";
import Loading from '../../Components/Loading/loading';
import Highlighter from 'react-highlight-words';
import MissingField from '../../Components/Validation/missingField';
import Hp from "../../assets/images/Hp.png";

import moment from 'moment';
// import jsonData from '../../VisualInspectionSample.json';

let record = [];
const dropdownData = ["Mainstream", "Derivative"];
const EditableContext = React.createContext();
const dateFormat = 'MM/DD/YYYY';

// let updatePolicy = '',updateSku = '', UpdateTier = '';
// let updateInternetDate = '', updateEmbargoDate ='',updatePriceDate = '',updatePolicyDate = '';

let dateEditable;
let flagProduct = false, flagOption = false, flagsku = false, flagDerivative = false, flagCompo = false, flagProductCategory = false;

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
      voidRecord: [],
      editingKey: "",
      flag: true,
      dateEdit: '',
      visible: false,
      confirmModal: false,
      addSKU: false,
      html: [],
      editFlag: false,
      showFlag: 'none',
      account: [],
      dataRecevied: false,
      sku: '',
      option: '',
      product_line: '',
      product_description: '',
      price: '',
      price1: '',
      downloadFolderName:'Current-hp-sku-filter.csv',
      productfilter: '',
      optionfilter: '',
      filterDerivative: '',
      upc: '',
      policyValue: '',
      filterSku: '',
      productCategory: "",
      tierValue: '',
      recordValue: ["No"],
      skuValue: '',
      accountValue: [],
      internetDate: '',
      adDate: '',
      priceDate: '',
      policyDate: '',
      show: false,
      spin: false,
      downloadData: [],
      backupData: [],
      derivativeRecord: [],
      mapped: '',
      upc: '',
      product_category: '',
      void_record: [],
      border: '',
      borderRadius: '1px',
      validMessage: ""
    };
    this.columns = [
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
        title: 'Policy',
        dataIndex: 'policy',
        key: 'policy',
        // ...this.getColumnSearchProps('Policy'),
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
        title: 'Product Category',
        dataIndex: 'product_category',
        key: 'product_category',
        // ...this.getColumnSearchProps('PL'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      },
      {
        title: 'Internet Ad Embargo Date',
        dataIndex: 'internet_ad_embargo_date',
        key: 'internet_ad_embargo_date',
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
        title: 'New MAP Price',
        dataIndex: 'new_map_price',
        key: 'new_map_price',
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
      // {
      //   title: 'New MAP Price',
      //   dataIndex: 'new_map_price',
      //   key: 'new_map_price',
      //   // ...this.getColumnSearchProps('Price Change Date'),
      //   render: text =><label style={{cursor:"pointer"}}>{text}</label>
      // },
      {
        title: 'Product Description',
        dataIndex: 'product_description',
        key: 'product_description',
        width: 200,
        // ...this.getColumnSearchProps('Product Description'),
        render: text => <label style={{ cursor: "pointer" }}>{text}</label>
      }
    ];
  }

  componentDidMount() {
    let dataPacket = [];
    const dropdownData = ["MAP"];
    const tier = ["Tier D (Supplies)"];
    const skuType = ["Mainstream", "Derivative"];
    const recordData = ["Yes", "No"];

    // const client = ["Aarons", "Amazon", "Staples", "Apple", "Best Buy", "Costco", "Micro Electronics", "Microsoft", "DH", "Essendant", "Frys", "HHO", "HSN", "Ingram", "New Age", "OD OMax", "QVX", "Sams", "SP Richards", "Synnex", , "Target", "Tech Data", "Supplies Network", "Walmart","Samsung Contractual Print Specialists ONLY"];
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN + '/capricing/api/pricelist')
        .then(response => {
          if (response.status === 200) {
            response.data.map((data) => {
              dataPacket.push({
                product: data.product,
                tier: data.tier,
                policy: data.policy,
                sku_type: data.sku_type,
                //derivative_list: JSON.parse(JSON.stringify(data.derivative_list)),
                derivative_list: data.derivative_list,
                pl: data.pl,
                internet_ad_embargo_date: data.internet_ad_embargo_date,
                ad_embargo_date: data.ad_embargo_date,
                map_price: data.map_price,
                price_change_date: data.price_change_date,
                product_description: data.product_description,
                off_map_date: data.off_map_date,
                product_category: data.product_category,
                map_price: data.map_price,
                new_map_price: data.new_map_price,
                option: data.option
              })
              this.setState({
                mapped: data.mapped
              })
            })
            this.setState({
              Tier: tier,
              policy: dropdownData,
              SKUType: skuType,
              updateData: dataPacket,
              backupData: dataPacket,
              voidRecord: recordData,
              downloadData: dataPacket,
              spin: false,
              dataRecevied: true
            }, () => this.DerivativeList());
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

  DerivativeList = () => {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN + '/capricing/api/getDerivativeList')
        .then(response => {
          console.log("api call1", response);
          if (response.status === 200) {
            this.setState({
              account: response.data,
            });
          }
        })
        .catch(function (error) {
          window.location.hash = "/";
        })
    })
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "", flag: true });
  };

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

  check = (event) => {
    // alert(event.target.id);
  }

  select = (value, id) => {
    if (id === "Sku_type") {
      if (value === "Derivative") {
        this.setState({
          showFlag: 'block',
          skuValue: value
        })
      }
      else if (value === "Mainstream") {
        this.setState({
          showFlag: 'none',
          skuValue: value
        })
      }
      else {
        this.setState({
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
    else if (id === "record_type") {
      this.setState({
        recordValue: value
      })
    }
    else if (id === "filterSku") {
      this.setState({
        filterSku: value
      })
    }
    else if (id === "productCategory") {
      this.setState({
        product_category: value,
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

  focus = () => {
    this.setState({
      validMessage: '',
      show: false
    })
  }

  blur = (event) => {
    let res = /^[a-z0-9]+$/i.test(event.target.value);
    if (res === false) {
      this.setState({
        sku: '',
        validMessage: 'SKU can be only of Alphanumeric Type like [A-Z] or [0-9]',
        show: true
      })
    }
  }

  text = (event) => {
    console.log(event.target);
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
        upc1: event.target.value,
      })
    }
    else if (event.target.id === "productNumber") {
      this.setState({
        productfilter: event.target.value
      })
    }
    else if (event.target.id === "filterOption") {
      this.setState({
        optionfilter: event.target.value
      })
    }
    else if (event.target.id === "filterDerivative") {
      this.setState({
        filterDerivative: event.target.value
      })
    }
    else if (event.target.id === "upcUpdate") {
      this.setState({
        upc: event.target.value
      })
    }
    else if (event.target.id === "product_category") {
      this.setState({
        product_category: event.target.value
      })
    }
  }
  multipleSelect = (selectedItems, event) => {
    if (selectedItems.length !== 0) {
      this.setState({
        accountValue: selectedItems
      })
    }
    else {
      record.derivative_list = [];
    }
  }

  addNew = () => {
    this.setState({
      addSKU: true,
      showFlag: 'none'
    })
  }

  refresh = () => {
    let data = this.state.backupData;
    this.setState({
      productfilter: '',
      optionfilter: '',
      filterSku: '',
      product_category: '',
      filterDerivative: '',
      updateData: data,
      spin: false
    })
  }

  add = () => {
    let data = this.state.backupData;
    if (this.state.productfilter != "" || this.state.optionfilter != "" || this.state.filterSku != "" || this.state.filterDerivative != "" || this.state.product_category != "") {
      // let temp = "GJ";
      const arr1 = data.filter(d =>
        d["pl"].toString().toLowerCase().indexOf(this.state.optionfilter.toLocaleLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(this.state.filterSku.toLocaleLowerCase()) > -1 &&
        d["product"].toString().toLowerCase().indexOf(this.state.productfilter.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.filterDerivative.toLocaleLowerCase()) > -1 &&
        d["product_category"].toString().toLowerCase().indexOf(this.state.product_category.toLocaleLowerCase()) > -1
      );
      this.setState({
        updateData: arr1,
        downloadData: arr1
      })
    }
  }



  handleOk = () => {
    // console.log(record);
    let data = this.state.updateData;
    let internetDate = moment().format('MM/DD/YYYY');
    let adDate = moment().format('MM/DD/YYYY');
    let priceDate = moment().format('MM/DD/YYYY');
    let policyDate = moment().format('MM/DD/YYYY');
    if (this.state.policyValue === "" || this.state.skuValue === ""
      || this.state.tierValue === "" || this.state.price1 === "" || this.state.sku === "") {
      this.setState({
        addSKU: true,
        show: true,
        border: "1px solid red",
        borderRadius: '2px',
        validMessage: "** Policy, SKU Type, SKU, Tier and Price are Mandatory fields."
      })
    }
    else if (this.state.skuValue === "Derivative" && this.state.accountValue.length === 0) {
      this.setState({
        addSKU: true,
        show: true,
        border: "1px solid red",
        borderRadius: '2px',
        validMessage: "For SKU Type as 'Derivative'.Please Select an Account."
      })
    }
    else if (parseInt(this.state.price1) < 0) {
      this.setState({
        validMessage: "Price Value cannot be Negetive."
      })
    }
    else {
      this.setState({
        border: '',
        borderRadius: '1px'
      })
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
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
            "mapped": "true"
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({
                addSKU: false,
                policyValue: '',
                skuValue: '',
                tierValue: '',
                sku: '',
                price: '',
                price1: '',
                option: '',
                product_line: '',
                product_category: '',
                product_description: '',
                price: '',
                upc: '',
                upc1: '',
                internetDate: '',
                adDate: '',
                priceDate: '',
                policyDate: '',
                dataRecevied: false,
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

  handleUpdate = () => {
    if (this.state.recordValue === "No") {
      this.setState({
        dataRecevied: false
      })
      let account = []; let product_sku = "";
      if (this.state.accountValue.length !== 0) {
        account = this.state.accountValue;
      }
      else {
        account = record.derivative_list;
      }
      if (record.option.length !== 0) {
        product_sku = record.product + '#' + record.option;
      }
      else {
        product_sku = record.product;
      }
      if (this.state.skuValue === "Derivative" && this.state.policyDate === undefined) {
        return new Promise((resolve, reject) => {
          axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
            {
              "tier": this.state.tierValue,
              "sku_type": this.state.skuValue,
              "derivative_list": account,
              "pl": record.pl,
              "product": product_sku,
              "product_description": record.product_description,
              "internet_ad_embargo_date": this.state.internetDate,
              "ad_embargo_date": this.state.adDate,
              "map_price": record.map_price,
              "price_change_date": this.state.priceDate,
              "new_map_price": this.state.price.length === 0 ? record.map_price : this.state.price,
              "off_map_date": this.state.policyDate === "" ? record.off_map_date : this.state.policyDate,
              "policy": this.state.policyValue,
              "product_category": record.product_category,
              "void_record": [this.state.recordValue],
              "mapped": "true",
              "upc": this.state.upc,
              "option": record.option
            })
            .then(response => {
              if (response.status === 200) {
                this.setState({
                  addSKU: false,
                  visible: false,
                  policyValue: '',
                  skuValue: '',
                  tierValue: '',
                  sku: '',
                  price: '',
                  option: '',
                  product_line: '',
                  product_description: '',
                  price: '',
                  upc: '',
                  internetDate: '',
                  adDate: '',
                  priceDate: '',
                  policyDate: '',
                  dataRecevied: false,
                  accountValue: []
                }, () => this.componentDidMount())
              }
            })
            .catch(function (error) {
              message.error('Server is Down. Please try Later!');
            })
        })
      }
      else if (this.state.skuValue === "Derivative" && this.state.policyDate !== undefined) {
        return new Promise((resolve, reject) => {
          axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
            {
              "tier": this.state.tierValue,
              "sku_type": this.state.skuValue,
              "derivative_list": account,
              "pl": record.pl,
              "product": product_sku,
              "product_description": record.product_description,
              "internet_ad_embargo_date": this.state.internetDate,
              "ad_embargo_date": this.state.adDate,
              "map_price": record.map_price,
              "price_change_date": this.state.priceDate,
              "new_map_price": this.state.price.length === 0 ? record.map_price : this.state.price,
              "off_map_date": this.state.policyDate === "" ? record.off_map_date : this.state.policyDate,
              "policy": this.state.policyValue,
              "product_category": record.product_category,
              "void_record": [this.state.recordValue],
              "mapped": "true",
              "upc": this.state.upc,
              "option": record.option
            })
            .then(response => {
              if (response.status === 200) {
                this.setState({
                  addSKU: false,
                  visible: false,
                  policyValue: '',
                  skuValue: '',
                  tierValue: '',
                  sku: '',
                  price: '',
                  option: '',
                  product_line: '',
                  product_description: '',
                  price: '',
                  upc: '',
                  internetDate: '',
                  adDate: '',
                  priceDate: '',
                  policyDate: '',
                  accountValue: []
                }, () => this.componentDidMount())
              }
            })
            .catch(function (error) {
              message.error('Server is Down. Please try Later!');
            })
        })
      }
      else if (this.state.skuValue === "Mainstream" && this.state.policyDate === undefined) {
        return new Promise((resolve, reject) => {
          axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
            {
              "tier": this.state.tierValue,
              "sku_type": this.state.skuValue,
              "derivative_list": account,
              "pl": record.pl,
              "product": product_sku,
              "product_description": record.product_description,
              "internet_ad_embargo_date": this.state.internetDate,
              "ad_embargo_date": this.state.adDate,
              "map_price": record.map_price,
              "price_change_date": this.state.priceDate,
              "new_map_price": this.state.price.length === 0 ? record.map_price : this.state.price,
              "off_map_date": this.state.policyDate === "" ? record.off_map_date : this.state.policyDate,
              "policy": this.state.policyValue,
              "product_category": record.product_category,
              "void_record": [this.state.recordValue],
              "mapped": "true",
              "upc": this.state.upc,
              "option": record.option
            })
            .then(response => {
              if (response.status === 200) {
                this.setState({
                  addSKU: false,
                  visible: false,
                  policyValue: '',
                  skuValue: '',
                  tierValue: '',
                  sku: '',
                  price: '',
                  option: '',
                  product_line: '',
                  product_description: '',
                  price: '',
                  upc: '',
                  internetDate: '',
                  adDate: '',
                  priceDate: '',
                  policyDate: ''
                }, () => this.componentDidMount())
              }
            })
            .catch(function (error) {
              message.error('Server is Down. Please try Later!');
            })
        })
      }
      else if (this.state.skuValue === "Mainstream" && this.state.policyDate !== undefined) {
        return new Promise((resolve, reject) => {
          axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
            {
              "tier": this.state.tierValue,
              "sku_type": this.state.skuValue,
              "derivative_list": account,
              "pl": record.pl,
              "product": product_sku,
              "product_description": record.product_description,
              "internet_ad_embargo_date": this.state.internetDate,
              "ad_embargo_date": this.state.adDate,
              "map_price": record.map_price,
              "price_change_date": this.state.priceDate,
              "new_map_price": this.state.price.length === 0 ? record.map_price : this.state.price,
              "off_map_date": this.state.policyDate === "" ? record.off_map_date : this.state.policyDate,
              "policy": this.state.policyValue,
              "product_category": record.product_category,
              "void_record": [this.state.recordValue],
              "mapped": "true",
              "upc": this.state.upc,
              "option": record.option
            })
            .then(response => {
              if (response.status === 200) {
                this.setState({
                  addSKU: false,
                  visible: false,
                  policyValue: '',
                  skuValue: '',
                  tierValue: '',
                  sku: '',
                  price: '',
                  option: '',
                  product_line: '',
                  product_description: '',
                  price: '',
                  upc: '',
                  internetDate: '',
                  adDate: '',
                  priceDate: '',
                  policyDate: ''
                }, () => this.componentDidMount())
              }
            })
            .catch(function (error) {
              message.error('Server is Down. Please try Later!');
            })
        })
      }
    }
    else {
      this.setState({
        confirmModal: true
      })
    }
  }

  handleDelete = () => {
    this.setState({
      dataRecevied: false
    })
    let account = []; let product_sku = "";
    if (this.state.accountValue.length !== 0) {
      account = this.state.accountValue;
    }
    else {
      account = record.derivative_list;
    }
    if (record.option.length !== 0) {
      product_sku = record.product + '#' + record.option;
    }
    else {
      product_sku = record.product;
    }
    if (this.state.skuValue === "Derivative" && this.state.policyDate === undefined) {
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
          {
            "tier": this.state.tierValue,
            "sku_type": this.state.skuValue,
            "derivative_list": account,
            "pl": record.pl,
            "product": product_sku,
            "product_description": record.product_description,
            "internet_ad_embargo_date": this.state.internetDate,
            "ad_embargo_date": this.state.adDate,
            "map_price": record.map_price,
            "price_change_date": this.state.priceDate,
            "new_map_price": this.state.price.length === 0 ? record.map_price : this.state.price,
            "off_map_date": this.state.policyDate === "" ? record.off_map_date : this.state.policyDate,
            "policy": this.state.policyValue,
            "product_category": record.product_category,
            "void_record": [this.state.recordValue],
            "mapped": "true",
            "upc": this.state.upc,
            "option": record.option
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({
                addSKU: false,
                visible: false,
                confirmModal: false,
                policyValue: '',
                skuValue: '',
                tierValue: '',
                sku: '',
                price: '',
                option: '',
                product_line: '',
                product_description: '',
                price: '',
                upc: '',
                internetDate: '',
                adDate: '',
                priceDate: '',
                policyDate: '',
                dataRecevied: false,
                accountValue: []
              }, () => this.componentDidMount())
            }
          })
          .catch(function (error) {
            message.error('Server is Down. Please try Later!');
          })
      })
    }
    else if (this.state.skuValue === "Derivative" && this.state.policyDate !== undefined) {
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
          {
            "tier": this.state.tierValue,
            "sku_type": this.state.skuValue,
            "derivative_list": account,
            "pl": record.pl,
            "product": product_sku,
            "product_description": record.product_description,
            "internet_ad_embargo_date": this.state.internetDate,
            "ad_embargo_date": this.state.adDate,
            "map_price": record.map_price,
            "price_change_date": this.state.priceDate,
            "new_map_price": this.state.price.length === 0 ? record.map_price : this.state.price,
            "off_map_date": this.state.policyDate === "" ? record.off_map_date : this.state.policyDate,
            "policy": this.state.policyValue,
            "product_category": record.product_category,
            "void_record": [this.state.recordValue],
            "mapped": "true",
            "upc": this.state.upc,
            "option": record.option
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({
                addSKU: false,
                visible: false,
                confirmModal: false,
                policyValue: '',
                skuValue: '',
                tierValue: '',
                sku: '',
                price: '',
                option: '',
                product_line: '',
                product_description: '',
                price: '',
                upc: '',
                internetDate: '',
                adDate: '',
                priceDate: '',
                policyDate: '',
                accountValue: []
              }, () => this.componentDidMount())
            }
          })
          .catch(function (error) {
            message.error('Server is Down. Please try Later!');
          })
      })
    }
    else if (this.state.skuValue === "Mainstream" && this.state.policyDate === undefined) {
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
          {
            "tier": this.state.tierValue,
            "sku_type": this.state.skuValue,
            "derivative_list": account,
            "pl": record.pl,
            "product": product_sku,
            "product_description": record.product_description,
            "internet_ad_embargo_date": this.state.internetDate,
            "ad_embargo_date": this.state.adDate,
            "map_price": record.map_price,
            "price_change_date": this.state.priceDate,
            "new_map_price": this.state.price.length === 0 ? record.map_price : this.state.price,
            "off_map_date": this.state.policyDate === "" ? record.off_map_date : this.state.policyDate,
            "policy": this.state.policyValue,
            "product_category": record.product_category,
            "void_record": [this.state.recordValue],
            "mapped": "true",
            "upc": this.state.upc,
            "option": record.option
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({
                addSKU: false,
                visible: false,
                confirmModal: false,
                policyValue: '',
                skuValue: '',
                tierValue: '',
                sku: '',
                price: '',
                option: '',
                product_line: '',
                product_description: '',
                price: '',
                upc: '',
                internetDate: '',
                adDate: '',
                priceDate: '',
                policyDate: ''
              }, () => this.componentDidMount())
            }
          })
          .catch(function (error) {
            message.error('Server is Down. Please try Later!');
          })
      })
    }
    else if (this.state.skuValue === "Mainstream" && this.state.policyDate !== undefined) {
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN + '/capricing/api/addAndUpdate',
          {
            "tier": this.state.tierValue,
            "sku_type": this.state.skuValue,
            "derivative_list": account,
            "pl": record.pl,
            "product": product_sku,
            "product_description": record.product_description,
            "internet_ad_embargo_date": this.state.internetDate,
            "ad_embargo_date": this.state.adDate,
            "map_price": record.map_price,
            "price_change_date": this.state.priceDate,
            "new_map_price": this.state.price.length === 0 ? record.map_price : this.state.price,
            "off_map_date": this.state.policyDate === "" ? record.off_map_date : this.state.policyDate,
            "policy": this.state.policyValue,
            "product_category": record.product_category,
            "void_record": [this.state.recordValue],
            "mapped": "true",
            "upc": this.state.upc,
            "option": record.option
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({
                addSKU: false,
                visible: false,
                confirmModal: false,
                policyValue: '',
                skuValue: '',
                tierValue: '',
                sku: '',
                price: '',
                option: '',
                product_line: '',
                product_description: '',
                price: '',
                upc: '',
                internetDate: '',
                adDate: '',
                priceDate: '',
                policyDate: ''
              }, () => this.componentDidMount())
            }
          })
          .catch(function (error) {
            message.error('Server is Down. Please try Later!');
          })
      })
    }
  }

  handleCancelConfirm = () => {
    this.setState({
      confirmModal: false
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      addSKU: false,
      show: false,
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
      border: '',
      borderRadius: '1px'
    })
  }

  tab = (event) => {
    if (event.target.id === "current") {
      window.location.hash = '/';
      this.setState({
        color: '#fffff !important'
      })
    }
    else if (event.target.id === "history") {
      window.location.hash = '/history';
      // this.props.history.push('/history');
    }
    else if (event.target.id === "notMap") {
      window.location.hash = '/notMapped';
      // this.props.history.push('/notMapped')
    }
    else if (event.target.id === "list") {
      window.location.hash = '/contact';
      // this.props.history.push('/contact');
    }
    else if (event.target.id === "offMap") {
      window.location.hash = '/offMap';
      // this.props.history.push('/offMap')
    }
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0]
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
      // textToHighlight={text.toString()}
      />
    ),
  });

  render() {
    let policyDate, SkuData, tierData, multiData, recordValue = [];
    if (this.state.dataRecevied) {
      policyDate = this.state.policy;
      SkuData = this.state.SKUType;
      tierData = this.state.Tier;
      multiData = this.state.account;
      recordValue = this.state.voidRecord;
    }

    let defaultValue = () => {
      this.setState({
        visible: true
      })
    }

    let rowIndex = (recordData) => {
      record = recordData;
      if (record.sku_type === "Derivative") {
        if (record["off_map_date"] !== undefined) {
          this.setState({
            price: record["new_map_price"],
            upc: record.upc,
            recordValue: 'No',
            policyDate: record["off_map_date"],
            priceDate: record["price_change_date"],
            adDate: record["ad_embargo_date"],
            internetDate: record["internet_ad_embargo_date"],
            policyValue: record.policy,
            tierValue: record.tier,
            sku: record.product,
            product_line: record.pl,
            product_description: record.product_description,
            skuValue: record.sku_type,
            derivativeRecord: record.derivative_list,
            showFlag: 'block'
          }, () => defaultValue())
        }
        else {
          this.setState({
            price: record["new_map_price"],
            upc: record.upc,
            recordValue: 'No',
            policyDate: '',
            priceDate: record["price_change_date"],
            adDate: record["ad_embargo_date"],
            internetDate: record["internet_ad_embargo_date"],
            policyValue: record.policy,
            tierValue: record.tier,
            sku: record.product,
            product_line: record.pl,
            product_description: record.product_description,
            skuValue: record.sku_type,
            derivativeRecord: record.derivative_list,
            showFlag: 'block'
          }, () => defaultValue())
        }

      }
      else {
        if (record["off_map_date"] !== undefined) {
          this.setState({
            visible: true,
            price: record["new_map_price"],
            upc: record.upc,
            recordValue: 'No',
            policyDate: '',
            priceDate: record["price_change_date"],
            adDate: record["ad_embargo_date"],
            internetDate: record["internet_ad_embargo_date"],
            policyValue: record.policy,
            tierValue: record.tier,
            sku: record.product,
            product_line: record.pl,
            product_description: record.product_description,
            skuValue: record.sku_type,
            derivativeRecord: record.derivative_list,
            showFlag: 'none'
          })
        }
        else {
          this.setState({
            visible: true,
            price: record["new_map_price"],
            upc: record.upc,
            recordValue: 'No',
            policyDate: record["off_map_date"],
            priceDate: record["price_change_date"],
            adDate: record["ad_embargo_date"],
            internetDate: record["internet_ad_embargo_date"],
            policyValue: record.policy,
            tierValue: record.tier,
            sku: record.product,
            product_line: record.pl,
            product_description: record.product_description,
            skuValue: record.sku_type,
            derivativeRecord: record.derivative_list,
            showFlag: 'none'
          })
        }

      }
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
        <div style={{ marginLeft: "-3em" }}>
          <Row style={{ marginTop: "2em" }}>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={3}>
                <label className="title">Current HP SKU Filter</label>
              </Col>
              <Col span={17}></Col>
              <Col span={2} style={{ marginLeft: "0.3em" }}><a href="#" onClick={this.addNew} title="Click here to add new SKU">Add New SKU</a></Col>
            </Col>
          </Row>
          <Row style={{ marginTop: "1.5em" }}>
            <Col span={23}>
              <Col span={22}>
                <Col span={1}></Col>
                <Col span={1}><label className="title1">Product#</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em", marginLeft: "0.5em" }} allowClear id="productNumber" onChange={this.text} value={this.state.productfilter}></Input></Col>

                <Col span={1}><label className="title1" style={{ marginLeft: "2em" }}>PL</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em", marginLeft: "-0.5em" }} allowClear id="filterOption" onChange={this.text} value={this.state.optionfilter}></Input></Col>

                <Col span={4}><label className="title1" style={{ marginLeft: "1em" }}>Product Category</label></Col>
                <Col span={2} style={{ marginTop: "-0.5em", marginLeft: "-4.5em" }}><DropdownProduct  placeholder={"Select Product Category..."} select={this.select} value={this.state.product_category} id="productCategory" /></Col>

                <Col span={1}></Col>
                <Col span={2}><label className="title1">SKU Type</label></Col>
                <Col span={2} style={{ marginTop: "-0.5em", marginLeft: "-1em" }}><Dropdown data={dropdownData} placeholder={"Select SKU Type..."} select={this.select} value={this.state.filterSku} id="filterSku" /></Col>
                <Col span={1}></Col>
                <Col span={2}><label className="title1">Derivative Reseller</label></Col>
                <Col span={2}><Input style={{ marginTop: "-1em" }} id="filterDerivative" allowClear onChange={this.text} value={this.state.filterDerivative}></Input></Col>
              </Col>
              <Col span={1}><Button type="primary" onClick={this.add} onPressEnter={this.add} style={{ marginTop: "-1em", marginLeft: "-8em" }} icon="search">Search</Button></Col>
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
              <Col span={4}><span className="title1">Current HP SKU Price list</span></Col>
              <Col span={16}></Col>
              <Col span={3} style={{ marginTop: "-0.5em" }}><Download downloadFolderName={this.state.downloadFolderName} data={this.state.downloadData} /></Col>
            </Col>
          </Row>
        </div>
        <div style={{ margin: "3em", marginTop: "1em", backgroundColor: "#fff" }}>
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
          <Modal
            visible={this.state.confirmModal}
            style={{ top: 200 }}
            width={300}
            closable={false}
            footer={[
              <Button key="back" onClick={this.handleCancelConfirm}>
                No
             </Button>,
              <Button key="submit" type="primary" onClick={this.handleDelete}>
                Yes
             </Button>,
            ]}>
            <div style={{ overflow: "auto" }}>
              <Col span={24}>
                <Icon type="question-circle-o" style={{ color: 'red' }} /><label className="title2" style={{ marginLeft: "0.5em" }}>Are you sure you want to Delete?</label>
              </Col>
            </div>
          </Modal>
          <Modal
            visible={this.state.visible}
            style={{ top: 30 }}
            width={750}
            closable={false}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Cancel
            </Button>,
              <Button key="submit" type="primary" onClick={this.handleUpdate}>
                Update
            </Button>,
            ]}>
            <div style={{ overflow: "auto" }}>
              <Col span={24}>
                <label className="title2">Current HP SKU Price List</label>
              </Col>
              <div style={{ marginTop: "3em" }}>
                <Col span={24}>
                  <Col span={5}><label className="title1">Policy<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown border={this.state.border} data={policyDate} select={this.select} id="policy" defaultValue={record["policy"]} value={this.state.policyValue} /></Col>
                  <Col span={1}></Col>
                  <Col span={5}><label className="title1">SKU Type<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown border={this.state.border} data={SkuData} placeholder="Select SKU Type" select={this.select} id="Sku_type" defaultValue={record.sku_type} value={this.state.skuValue} /></Col>
                </Col>
                <br /><br />
                <Col span={24}>
                  <Col span={5}><label className="title1">Tier<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown border={this.state.border} defaultValue={record["tier"]} data={tierData} placeholder="Select Tier" select={this.select} id="trier" value={this.state.tierValue} /></Col>
                  <Col span={1}></Col>
                  <Col span={13} style={{ display: this.state.showFlag }} >
                    <MultipleSelect dataOptions={multiData} placeholder={"Select Accounts..."} width={270} multipleSelect={this.multipleSelect} defaultValue={this.state.derivativeRecord} />
                  </Col>
                </Col>
                <br /><br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Product #</label></Col>
                  <Col span={5}><label className="title1">{record["product"]}</label></Col>
                  <Col span={2}></Col>
                  <Col span={4}><label className="title1">Option</label></Col>
                  <Col span={5}><label className="title1">{record.Partner_First_Status_Print}</label></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Product Line</label></Col>
                  <Col span={5}><label className="title1">{record["pl"]}</label></Col>
                  <Col span={2}></Col>
                  <Col span={4}><label className="title1">Product Description</label></Col>
                  <Col span={5}><label className="title1">{record["product_description"]}</label></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Internet Ad Embargo Date</label></Col>
                  <Col span={4}><Datepicker defaultVal={true} action={this.dateSelect} placeholder="Select Date" defaultValue={record["internet_ad_embargo_date"]} width={154} id={"internet_date"} value={this.state.internetDate} /></Col>
                  <Col span={3}></Col>
                  <Col span={4}><label className="title1">Ad Embargo Date</label></Col>
                  <Col span={4}><Datepicker defaultVal={true} action={this.dateSelect} placeholder="Select Date" defaultValue={record["ad_embargo_date"]} width={154} id={"ad_date"} value={this.state.adDate} /></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Price Effective Date</label></Col>
                  <Col span={4}><Datepicker defaultVal={true} action={this.dateSelect} placeholder="Select Date" defaultValue={record["price_change_date"]} width={154} id={"price_date"} value={this.state.priceDate} /></Col>
                  <Col span={3}></Col>
                  <Col span={4}><label className="title1">Off Policy Date</label></Col>
                  <Col span={4}><Datepicker defaultVal={true} action={this.dateSelect} placeholder="Select Date" defaultValue={record["off_map_date"]} width={154} id={"policy_date"} value={this.state.policyDate} /></Col>
                </Col>
                <br /><br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Price<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%", border: this.state.border }} id="price" value={this.state.price} /></Col>
                  <Col span={2}></Col>
                  <Col span={4}><label className="title1">UPC</label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%" }} id="upcUpdate" value={this.state.upc} /></Col>
                </Col>
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={5}><label className="title1">VOID Record</label></Col>
                  <Col span={5}><Dropdown data={recordValue} placeholder="Select Record" select={this.select} id="record_type" defaultValue={"No"} value={this.state.recordValue} /></Col>
                  <Col span={1}></Col>
                  <Col span={4}><label className="title1">Product Category</label></Col>
                  <Col span={5}><label className="title1">{record["product_category"]}</label></Col>
                </Col>
              </div>
            </div>
          </Modal>
          <Modal
            visible={this.state.addSKU}
            forceRender
            style={{ top: 30 }}
            width={750}
            closable={false}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Cancel
            </Button>,
              <Button key="submit" type="primary" onClick={this.handleOk}>
                Add
            </Button>,
            ]}>
            <div style={{ overflow: "hidden" }}>
              <MissingField show={this.state.show} message={this.state.validMessage} />
              <Col span={24} style={{ marginTop: "0.5em" }}>
                <label className="title2">Add a New SKU</label>
              </Col>
              <div style={{ marginTop: "3em" }}>
                <Col span={24}>
                  <Col span={5}><label className="title1">Policy<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown data={policyDate} border={this.state.border} placeholder="Select Policy" select={this.select} id="policy" value={this.state.policyValue} /></Col>
                  <Col span={1}></Col>
                  <Col span={5}><label className="title1">SKU Type<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown data={SkuData} border={this.state.border} placeholder="Select SKU Type" select={this.select} id="Sku_type" value={this.state.skuValue} /></Col>
                </Col>
                <br /><br />
                <Col span={24}>
                  <Col span={5}><label className="title1">Tier<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Dropdown data={tierData} border={this.state.border} placeholder="Select Tier" select={this.select} id="trier" value={this.state.tierValue} /></Col>
                  <Col span={1}></Col>
                  <Col span={13} style={{ display: this.state.showFlag }} >
                    <MultipleSelect dataOptions={multiData} placeholder={"Select Accounts..."} width={270} multipleSelect={this.multipleSelect} />
                  </Col>
                </Col>
                <br /><br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">SKU<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} onBlur={this.blur} onFocus={this.focus} style={{ width: "105%", border: this.state.border, borderRadius: this.state.borderRadius }} id="SKU" value={this.state.sku} /></Col>
                  <Col span={2}></Col>
                  <Col span={4}><label className="title1">Product Line</label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%" }} id="product_line" value={this.state.product_line} /></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={5}><label className="title1">Product Category</label></Col>
                  <Col span={5}><DropdownProduct placeholder={"Select Product Category..."} select={this.select} value={this.state.product_category} id="productCategory" /></Col>
                  <Col span={1}></Col>
                  <Col span={4}><label className="title1">Product Description</label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%" }} id="product_description" value={this.state.product_description} /></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Internet Ad Embargo Date</label></Col>
                  <Col span={4}><Datepicker action={this.dateSelect} width={154} id={"internet_date"} defaultVal={false} value={this.state.internetDate} defaultValue={this.state.internetDate} /></Col>
                  <Col span={3}></Col>
                  <Col span={4}><label className="title1">Ad Embargo Date</label></Col>
                  <Col span={4}><Datepicker action={this.dateSelect} width={154} id={"ad_date"} defaultVal={false} value={this.state.adDate} defaultValue={this.state.adDate} /></Col>
                </Col>
                <br /> <br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Price Effective Date</label></Col>
                  <Col span={4}><Datepicker action={this.dateSelect} width={154} id={"price_date"} defaultVal={false} value={this.state.priceDate} defaultValue={this.state.priceDate} /></Col>
                  <Col span={3}></Col>
                  <Col span={4}><label className="title1">Off Policy Date</label></Col>
                  <Col span={4}><Datepicker action={this.dateSelect} width={154} id={"policy_date"} defaultVal={false} value={this.state.policyDate} defaultValue={this.state.policyDate} /></Col>
                </Col>
                <br /><br />
                <Col span={24} style={{ marginTop: "0.5em" }}>
                  <Col span={4}><label className="title1">Price<span style={{ color: "red" }}>*</span></label></Col>
                  <Col span={5}><InputNumber allowClear step={1} onChange={this.inputNumberAdd} style={{ width: "105%", border: this.state.border, borderRadius: this.state.borderRadius }} id="Addprice" value={this.state.price1} /></Col>
                  <Col span={2}></Col>
                  <Col span={4}><label className="title1">UPC</label></Col>
                  <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%" }} id="upc" value={this.state.upc1} /></Col>
                </Col>
              </div>
            </div>
          </Modal>

        </div>
      </div>
    ) : (<Loading status={this.state.dataRecevied} />)

    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
