import React from "react";
import "./offMap.css";
import "antd/dist/antd.css";
import Tab from "../../Components/Tab/Tab";
import { Table, Input, Col, Form, Button, Row, Divider, Tooltip, Icon, message } from "antd";
import Dropdown from '../../Components/Select/select';
import DropdownProduct from '../../Components/DropdownProduct/DropdownPro';
import Download from '../../Components/Download/csvDownload';
// import ModalClass from '../../Components/Modal/modal';
import Loading from '../../Components/Loading/loading';
// import jsonData from '../../offMap.json';
import axios from "axios";
import Hp from "../../assets/images/Hp.png";
let record =[], columns;
const dropdownData = ["Mainstream","Derivative"];
const ButtonGroup = Button.Group;
let flagSkuType= false, flagOption = false, flagsku = false, flagDerivative=false, flagCompo = false;

const EditableContext = React.createContext();

class offMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      policy:[],
      SKUType:[],
      Tier:[],
      updateData:[],
      editingKey: "",
      flag: true,
      dateEdit: '',
      visible: false,
      addSKU: false,
      html: [],
      editFlag: false,
      showFlag: 'none',
      account:[],
      dataRecevied:false,
      sku:'',
      option:'',
      product_line:'',
      product_description:'',
      price:'',
      upc:'',
      policyValue:'',
      tierValue:'',
      skuValue:'',
      accountValue:'',
      internetDate:'',
      downloadFolderName:'Off-map-sku-filter.csv',
      adDate:'',
      priceDate:'',
      policyDate:'',
      skufilter:'',
      optionfilter:'',
      productCategory:'',
      skutype:'',
      derivativefilter:'',
      downloadData:[],
      backupData:[]
    };
    
    columns = [
      {
        title: 'Product#',
        dataIndex: 'product',
        key: 'product',
        width: 100,
        // ...this.getColumnSearchProps('Product #'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      {
        title: 'Tier',
        dataIndex: 'tier',
        key: 'tier',
        width: 100,
        // ...this.getColumnSearchProps('Tier'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      {
        title: 'Policy',
        dataIndex: 'policy',
        key: 'policy',
        // ...this.getColumnSearchProps('Policy'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      {
        title: 'SKU Type',
        dataIndex: 'sku_type',
        key: 'sku_type',
        // ...this.getColumnSearchProps('SKU Type'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      {
        title: 'Derivative List',
        dataIndex: 'derivative_list',
        key: 'derivative_list',
        // ...this.getColumnSearchProps('Derivative List'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      {
        title: 'Product Line',
        dataIndex: 'pl',
        key: 'pl',
        // ...this.getColumnSearchProps('PL'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      {
        title: 'Internet Ad Embargo Date',
        dataIndex: 'internet_ad_embargo_date',
        key: 'internet_ad_embargo_date',
        // ...this.getColumnSearchProps('Internet Ad Embargo Date'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      {
        title: 'Ad Embargo Date',
        dataIndex: 'ad_embargo_date',
        key: 'ad_embargo_date',
        // ...this.getColumnSearchProps('Ad Embargo Date'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      // {
      //   title: 'Current MAP Price',
      //   dataIndex: 'map_price',
      //   key: 'map_price',
      //   // ...this.getColumnSearchProps('MAP Price'),
      //   render: text =><label style={{cursor:"pointer"}}>{text}</label>
      // },
      {
        title: 'Off MAP Date',  // title: 'Price Change Date', -> kit
        dataIndex: 'off_map_date',// dataIndex:price_change_date,-> kit
        key: 'price_change_date',
        // ...this.getColumnSearchProps('Price Change Date'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      },
      {
        title: 'Product Description',
        dataIndex: 'product_description',
        key: 'product_description',
        width: 200,
        // ...this.getColumnSearchProps('Product Description'),
        render: text =><label style={{cursor:"pointer"}}>{text}</label>
      }
    ];
  }

  componentDidMount() {
    const dropdownData = ["CF512A", "CF513A", "CZ992A"];
    const tier = ["Tier A","Tier B","Tier C","Tier D","Tier E"];
    const skuType = ["Mainstream", "Derivative"];
    const client = ["Aarons", "Amazon", "Apple", "Best Buy", "BJs", "Costco", "Micro Electronics", "Microsoft", "DH", "Essendant", "Frys", "HHO", "HSN", "Ingram", "New Age", "OD OMax", "QVX", "Sams", "SP Richards", "Staples", "Synnex", , "Target", "Tech Data", "Supplies Network", "Walmart"];
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN+'/capricing/api/offPriceList')
          .then(response => {
              if (response.status === 200) {
                let updatedDownloadData = response.data;
                if(updatedDownloadData.length !== 0){
                  updatedDownloadData.map((key) =>{
                    delete key.key
                  })
    }
                this.setState({
                  Tier:tier,
                  policy:dropdownData,
                  SKUType:skuType,
                  account:client,
                  updateData:response.data,
                  backupData:response.data,
                  downloadData:updatedDownloadData,
                  dataRecevied:true
                });
              }
          })
          .catch(function (error) {
              window.location.href="/";
          })
    })
  }


  Change = (dateString, dateFormat) => {
    this.setState({ dateEdit: dateFormat })
  }

  isEditing = record => record.key === this.state.editingKey;

  select = (value,id) => {
    if(id === "skutype"){
      this.setState({
        skutype: value
      })
    }
    else if(id === "productCategory"){
      this.setState({
        productCategory:value,
      })
    }
  }

  dateSelect = (date,dateString,id) =>{
    if(id === "internet_date"){
      this.setState({
          internetDate: dateString
      })
    }
    else if(id === "ad_date"){
      this.setState({
        adDate: dateString
    })
    }
    else if(id === "price_date"){
      this.setState({
        priceDate: dateString
      })
    }
    else if(id === "policy_date"){
      this.setState({
        policyDate: dateString
     })
    }
  }
  refresh = () => {
    let data = this.state.backupData;
    this.setState({
      skufilter:'',
      updateData:data,
      optionfilter:'',
      derivativefilter:'',
      productCategory:'',
      skutype:''
    }, () => this.componentDidMount())
  }
  add = () => {
    let data = this.state.backupData;
    console.log("hello data", data);
    if(this.state.skufilter != "" || this.state.optionfilter != "" || this.state.skutype != "" || this.state.derivativefilter !="" || this.state.productCategory!=""){
      // let temp = "GJ";
      const arr1 = data.filter(d =>
        d["pl"].toString().toLowerCase().indexOf(this.state.optionfilter.toLocaleLowerCase()) > -1 &&
        d["sku_type"].toString().toLowerCase().indexOf(this.state.skutype.toLocaleLowerCase()) > -1 &&
        d["product"].toString().toLowerCase().indexOf(this.state.skufilter.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.derivativefilter.toLocaleLowerCase()) > -1 &&
        d["product_category"].toString().toLowerCase().indexOf(this.state.productCategory.toLocaleLowerCase()) > -1
      );
      this.setState({
        updateData: arr1,
        downloadData: arr1
      })
    }
  }

  text = (event) =>{
    if(event.target.id === 'SKU'){
      this.setState({
        sku: event.target.value
      })
    }
    else if(event.target.id === "option"){
      this.setState({
        option: event.target.value
      })
    }
    else if(event.target.id === "product_line"){
      this.setState({
        product_line: event.target.value
      })
    }
    else if(event.target.id === "product_description"){
      this.setState({
        product_description: event.target.value
      })
    }
    else if(event.target.id === "price"){
      this.setState({
        price: event.target.value
      })
    }
    else if(event.target.id === "upc"){
      this.setState({
        upc: event.target.value
      })
    }
    else if (event.target.id === "skufilter"){
      this.setState({
        skufilter: event.target.value
      })
    }
    else if(event.target.id === "optionfilter"){
      this.setState({
        optionfilter: event.target.value
      })
    }
    else if(event.target.id === "derivativefilter"){
      this.setState({
        derivativefilter: event.target.value
      })
    }
  }

  multipleSelect = (selectedItems, event) => {
    this.setState({
      accountValue : selectedItems
    })
  }

  addNew = () => {
    this.setState({
      addSKU: true,
      sku:'',
      option:'',
      product_line:'',
      product_description:'',
      price:'',
      upc:'',
      policyValue:'',
      skuValue: '',
      tierValue: ''

    })
  }

  render() {
    let policyDate,SkuData,tierData,multiData =[];
    if(this.state.dataRecevied){
      policyDate = this.state.policy;
      SkuData = this.state.SKUType;
      tierData = this.state.Tier;
      multiData = this.state.account;
    }
    let rowIndex = (recordData) => {
      record = recordData;
      console.log(record);
      this.setState({
        visible: true,
        price: record.Seller_Advertised_Price
      })
    }

    return (this.state.dataRecevied === true ?  (
      <div>
      <div style={{marginLeft:"-3em" }}>
        <Row style={{ marginTop: "1em" }}>
          <Col span={24}>
            <Col span={1}></Col>
            <Col span={3}>
              <label className="title">OFF MAP SKU Filter</label>
            </Col>
            <Col span={17}></Col>
          </Col>
        </Row>
        <Row style={{ marginTop: "1.5em" }}>
          <Col span={23}>
            <Col span={22}>
              <Col span={1}></Col>
              <Col span={1}><label className="title1">Product#</label></Col>
              <Col span={2}><Input style={{ marginTop: "-1em",marginLeft:"0.5em" }} allowClear id="skufilter" onChange={this.text} value={this.state.skufilter} /></Col>
             
              <Col span={1}><label className="title1" style={{marginLeft:"2em"}}>PL</label></Col>
              <Col span={2}><Input style={{ marginTop: "-1em", marginLeft:"0.5em" }} allowClear id="optionfilter" onChange={this.text} value={this.state.optionfilter}></Input></Col>
              
              <Col span={4}><label className="title1" style={{ marginLeft: "2em" }}>Product Category</label></Col>
                <Col span={2} style={{ marginTop: "-0.5em", marginLeft: "-3.5em" }}><DropdownProduct placeholder={"Select Product Category..."} select={this.select} value={this.state.productCategory} id="productCategory" /></Col>

              <Col span={1}></Col>
              <Col span={2}><label className="title1">SKU Type</label></Col>
              <Col span={2} style={{ marginTop: "-0.5em", marginLeft:"-1em" }}><Dropdown allowClear data={dropdownData} placeholder={"Select SKU Type..."} id="skutype" value={this.state.skutype} select={this.select}/></Col>
              <Col span={1}></Col>
              <Col span={2}><label className="title1">Derivative Reseller</label></Col>
              <Col span={2}><Input style={{ marginTop: "-1em" }} allowClear id="derivativefilter" onChange={this.text} value={this.state.derivativefilter}></Input></Col>
            </Col>
            <Col span={1}><Button type="primary" onClick={this.add} style={{ marginTop: "-1em" , marginLeft:"-7em"}} icon="search">Search</Button></Col>
          </Col>
          <Col span={1}></Col>
          <Col span={2} style={{marginLeft:"-12em"}}><Tooltip placement="right" title="Refresh"><span style={{color:"#0095d9", fontSize:"16px", cursor:"pointer"}} onClick={this.refresh}>Clear All</span></Tooltip></Col>
        </Row>
        <Row>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={22}><Divider /></Col>
              <Col span={2}></Col>
            </Col>
        </Row>
        <Row>
            <Col span={24} style={{marginTop:"-1em"}}>
              <Col span={1}></Col>
              <Col span={4}><span className="title1">OFF MAP SKU LIST</span></Col>
              <Col span={16}></Col>
              <Col span={3}><Download downloadFolderName={this.state.downloadFolderName} data={this.state.downloadData}/></Col>
            </Col>
        </Row>
      </div>
      <div style={{ margin: "3em", marginTop: "0.5em", backgroundColor: "#fff" }}>
        <EditableContext.Provider value={this.props.form}>
          <Table
            bordered
            dataSource={this.state.updateData}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              pageSize: 15
            }}
            style={{marginLeft:"-3em" }}
            onRow={(record) => ({ onClick: () => { rowIndex(record); } })}
          />
        </EditableContext.Provider>
      </div>
    </div>
    ):(<Loading status={this.state.dataRecevied} />)

    );
  }
}

const EditableFormTable = Form.create()(offMap);

export default EditableFormTable;
