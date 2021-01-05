import React from "react";
import "./contactList.css";
import "antd/dist/antd.css";
import Tab from "../../Components/Tab/Tab";
import { Table, Input, Col, Popconfirm, Form, Button, Icon, Collapse, Row, Tooltip, message, Modal, Checkbox, notification, Select } from "antd";
// import jsonData from "../../contactlist.json";
import Dropdown from '../../Components/Select/select';
import Download from '../../Components/Download/csvDownload';
import MultipleSelect from "../../Components/MultiSelect/multiSelect";
import axios from "axios";
import MissingField from '../../Components/Validation/missingField';
import Datepicker from '../../Components/Datepicker/datepicker';
import Highlighter from 'react-highlight-words';
import Hp from '../../assets/images/Hp.png';
import _ from 'lodash';


// import moment from 'moment';
const { Panel } = Collapse;
const ButtonGroup = Button.Group;
const dropdownData = ["Internal", "External"];
const derivativeList = ["Mainstream", "Derivative"];
// const receivesMasterLife = ["Sams Walmart", "Walmart", "BJs", "Target"];

const EditableContext = React.createContext();
const { Option } = Select;
// const dateFormat = 'MM/DD/YYYY';

let dateEditable, dataPacket = [];
let recordData = [], editAccounts = [];
let flagName = false, flagContact = false, flagCompany = false, flagDerivative = false, flagMaster = false;

let emailStyle = {
  width: "105%",
  marginLeft: "-2em"
}

class EditableCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      option: []
    }
  }

  // componentDidMount(){
  //   return new Promise((resolve, reject) => {
  //     axios.get('/capricing/api/getDerivativeList')
  //         .then(response => {
  //             if (response.status === 200) {
  //               this.setState({
  //                 option:response.data,
  //               });
  //             }
  //         })
  //         .catch(function (error) {
  //             window.location.hash="/";
  //         })
  //   })
  // }


  getInput = () => {
    if (this.props.dataIndex === "contact_type") {
      return <Select defaultValue={this.props.record.contact_type} style={{ width: 100 }}>
        <Option value="Internal">Internal</Option>
        <Option value="External">External</Option>
      </Select>
    }
    else if (this.props.dataIndex === "derivative") {
      return <Select defaultValue={this.props.record.derivative} style={{ width: 110 }}>
        <Option value="Mainstream">Mainstream</Option>
        <Option value="Derivative">Derivative</Option>
      </Select>
    }
    else if (this.props.dataIndex === "derivative_list") {
      return <Select placeholder={"Select Account"} defaultValue={this.props.record.derivative_list} style={{ width: 120 }} mode="multiple">
        {editAccounts.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    }
    else {
      return <Input type="text" allowClear />;
    }

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
      editingKey: "",
      flag: true,
      dateEdit: '',
      visible: false,
      addSKU: false,
      html: [],
      modalButton1: '',
      modalButton2: '',
      editFlag: false,
      showFlag: 'none',
      account: [],
      dataRecevied: false,
      derivative_list: '',
      price: '',
      upc: '',
      policyValue: '',
      tierValue: '',
      skuValue: '',
      accountValue: [],
      show: false,
      showModal: false,
      firstName: '',
      lastName: '',
      derivative: '',
      email: '',
      jobtitle: '',
      company: '',
      receives_masterlife: false,
      contact: '',
      masterlife: [],
      name: '',
      backupData: [],
      downloadData: [],
      selectedRowKeys: [],
      missingMessage: '',
      checked: true,
      loading: false
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
        title: "Email Address",
        dataIndex: "email",
        width: "150",
        editable: false,
        // render: text => <DatePicker disabled={this.state.flag} onClick={this.modalOpen} defaultValue={moment(text, dateFormat)} format={dateFormat} onChange={this.Change} id="text">{text}</DatePicker>
      },
      {
        title: "Contact Type",
        dataIndex: "contact_type",
        width: "100",
        editable: true,
        // ...this.getColumnSearchProps('contact_type'),
        render: text => <label onClick={this.modalOpen}>{text}</label>
      },
      {
        title: "SKU Type",
        dataIndex: "derivative",
        width: "150",
        editable: true,
        // render: text => <DatePicker disabled={this.state.flag} onClick={this.modalOpen} defaultValue={moment(text, dateFormat)} format={dateFormat} onChange={this.Change} id="text">{text}</DatePicker>
      },

      {
        title: "First Name",
        dataIndex: "firstName",
        width: "100",
        editable: true,
        render: text => <label onClick={this.modalOpen}>{text}</label>
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        width: "100",
        editable: true,
        render: text => <label onClick={this.modalOpen}>{text}</label>
      },
      {
        title: "Company",
        dataIndex: "company",
        width: "150",
        editable: true,
        // render: text => <DatePicker disabled={this.state.flag} onClick={this.modalOpen} defaultValue={moment(text, dateFormat)} format={dateFormat} onChange={this.Change} id="text">{text}</DatePicker>
      },
      {
        title: "Job Title",
        dataIndex: "job_title",
        width: "150",
        editable: true,
        // render: text => <DatePicker disabled={this.state.flag} onClick={this.modalOpen} defaultValue={moment(text, dateFormat)} format={dateFormat} onChange={this.Change} id="text">{text}</DatePicker>
      },
      {
        title: "Derivative List",
        dataIndex: "derivative_list",
        width: "150",
        editable: true,
        // render: text => <DatePicker disabled={this.state.flag} onClick={this.modalOpen} defaultValue={moment(text, dateFormat)} format={dateFormat} onChange={this.Change} id="text">{text}</DatePicker>
      },
      {
        title: "Receives Masterfile",
        dataIndex: "master_life",
        width: "120",
        editable: true,
        // render: text => <DatePicker disabled={this.state.flag} onClick={this.modalOpen} defaultValue={moment(text, dateFormat)} format={dateFormat} onChange={this.Change} id="text">{text}</DatePicker>
      },
    ];
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
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
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
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

  componentDidMount() {
    dataPacket = []; let keyData = [];
    const skuType = ["Mainstream", "Derivative"];
    // const client = ["Aarons", "Amazon", "Apple", "Best Buy", "BJs", "Costco", "Micro Electronics", "Microsoft", "DH", "Essendant", "Frys", "HHO", "HSN", "Ingram", "New Age", "OD OMax", "QVX", "Sams", "SP Richards", "Staples", "Synnex", , "Target", "Tech Data", "Supplies Network", "Walmart"];
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN+'/capricing/api/contactList')
        .then(response => {
          if (response.status === 200) {
            response.data.map((data, i) => {
              if (data.email_address === "") {
                dataPacket.push({
                  key: "abc@hp.com",
                  contact_type: data.contact_type,
                  firstName: data.first_name,
                  lastName: data.last_name,
                  company: data.company,
                  email: data.email_address,
                  job_title: data.job_title,
                  master_life: data.receives_masterFile.split('')[0].toUpperCase() + data.receives_masterFile.substr(1),
                  derivative: data.derivative_type,
                  derivative_list: data.derivative_list,
                  email_send_status: data.email_send_status
                })
              }
              else {
                dataPacket.push({
                  key: data.email_address,
                  contact_type: data.contact_type,
                  firstName: data.first_name,
                  lastName: data.last_name,
                  company: data.company,
                  email: data.email_address,
                  job_title: data.job_title,
                  master_life: data.receives_masterFile.split('')[0].toUpperCase() + data.receives_masterFile.substr(1),
                  derivative: data.derivative_type,
                  derivative_list: data.derivative_list,
                  email_send_status: data.email_send_status
                })
              }
            })
            keyData = dataPacket;
            this.setState({
              data: dataPacket,
              backupData: dataPacket,
              downloadData: dataPacket,
              SKUType: skuType,
              dataRecevied: true
            }, () => this.DerivativeList())
          }
        })
        .catch(function (error) {
          window.location.hash = "/";
        })
    })
  }

  DerivativeList = () => {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN+'/capricing/api/getDerivativeList')
        .then(response => {
          if (response.status === 200) {
            this.setState({
              account: response.data,
            });
            editAccounts = response.data;
          }
        })
        .catch(function (error) {
          window.location.hash = "/";
        })
    })
  }

  Change = (dateString, dateFormat) => {
    this.setState({ dateEdit: dateFormat })
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "", flag: true, show: false });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      console.log(recordData);
      let result = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recordData.email);
      if (index > -1) {
        newData[index].role = this.state.dateEdit;
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        let res;
        if (row.derivative_list.length !== 0) {
          if (typeof (row.derivative_list) !== 'object') {
            res = row.derivative_list.split(" ");
          }
        }
        if (recordData.email.length !== 0) {
          if (result === false) {
            this.setState({
              show: true,
              missingMessage: " ** Please Enter a valid Email ID."
            })
            if (row.contact_type === "Internal" && recordData.email.split("@")[1].split('.')[0] !== "hp") {
              this.setState({
                show: true,
                missingMessage: " ** Please Enter a valid Internal Email ID."
              })
            }
            else if (row.contact_type === "External" && recordData.email.split("@")[1].split('.')[0] === "hp") {
              this.setState({
                show: true,
                missingMessage: " ** Please Enter a valid External Email ID."
              })
            }
          }
          else if (result) {
            if (row.contact_type === "Internal" && recordData.email.split("@")[1].split('.')[0] !== "hp") {
              this.setState({
                show: true,
                missingMessage: " ** Please Enter a valid Internal Email ID."
              })
            }
            else if (row.contact_type === "External" && recordData.email.split("@")[1].split('.')[0] === "hp") {
              this.setState({
                show: true,
                missingMessage: " ** Please Enter a valid External Email ID."
              })
            }
            else if (row.derivative === "Mainstream" && row.derivative_list.length !== 0) {
              this.setState({
                show: true,
                missingMessage: " ** An account can be associated only with SKU Type as 'Derivative'."
              })
            }
            else if (row.derivative === "Derivative" && row.derivative_list.length === 0) {
              this.setState({
                show: true,
                missingMessage: " ** For SKU Type as 'Derivative'. Please add an account(s)."
              })
            }
            else {
              return new Promise((resolve, reject) => {
                axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/updateContactList',
                  {
                    "contact_type": row.contact_type,
                    "first_name": row.firstName,
                    "last_name": row.lastName,
                    "company": row.company,
                    "email_address": recordData.email,
                    "job_title": row.job_title,
                    "receives_masterFile": row.master_life.toString(),
                    "derivative_type": row.derivative,
                    "derivative_list": row.derivative_list
                  })
                  .then(response => {
                    if (response.status === 200) {
                      this.setState({
                        data: newData,
                        editingKey: "",
                        flag: true,
                        show: false
                      })
                    }
                  })
                  .catch(function (error) {
                    message.error('Server is Down. Please try Later!');
                  })
              })
            }
          }
        }
        else {
          this.setState({
            show: true,
            missingMessage: " ** Email ID is a Mandatory Field."
          })
        }
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
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/deleteContactList',
          {
            "contact_type": item.contact_type,
            "first_name": item.firstName,
            "last_name": item.lastName,
            "company": item.company,
            "email_address": item.email,
            "job_title": item.job_title,
            "receives_masterlife": item.master_life.toString(),
            "derivative_test": item.derivative,
            "derivative_list": item.derivative_list
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({
                data: newData,
                editingKey: "",
                dataRecevied: false
              }, () => this.componentDidMount());
            }
          })
          .catch(function (error) {
            message.error('Server is Down. Please try Later!');
          })
      })
    } else {
      this.setState({ data: newData, editingKey: "" });
    }

  }

  edit(key) {
    this.setState({ editingKey: key, flag: false, editFlag: true, show: false });
  }

  check = (event) => {
    alert(event.target.id);
  }

  select = (value, id) => {
    if (id === "derivativeList") {
      if (value === "Derivative") {
        this.setState({
          showFlag: 'block',
          derivative: value
        })
      }
      else if (value === "Mainstream") {
        this.setState({
          showFlag: 'none',
          derivative: value
        })
      }
      else {
        this.setState({
          derivative: value
        })
      }
    }
    else if (id === "contact") {
      this.setState({
        contact: value
      })
    }
    else if (id === "derivative_list") {
      this.setState({
        derivative_list: value
      })
    }
  }

  text = (event) => {
    if (event.target.id === 'firstName') {
      this.setState({
        firstName: event.target.value
      })
    }
    else if (event.target.id === 'lastName') {
      this.setState({
        lastName: event.target.value
      })
    }
    else if (event.target.id === 'company') {
      this.setState({
        company: event.target.value
      })
    }
    else if (event.target.id === 'email') {
      this.setState({
        email: event.target.value
      })
    }
    else if (event.target.id === 'jobtitle') {
      this.setState({
        jobtitle: event.target.value
      })
    }
    else if (event.target.id === 'receives_masterfile') {
      this.setState({
        receives_masterlife: event.target.checked
      })
    }
  }

  multipleSelectfilter = (selectedItems, event) => {
    this.setState({
      masterlife: selectedItems
    })
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

  inputText = (event) => {
    if (event.target.id === "name") {
      this.setState({
        name: event.target.value
      })
    }
    else if (event.target.id === "company") {
      this.setState({
        company: event.target.value
      })
    }
    else if (event.target.id === "derivative_list") {
      this.setState({
        derivative_list: event.target.value
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
            <label className="title1">SKU</label>
            <Input id="sku" onChange={this.inputText}></Input>
          </Col>
          <Col span={1}></Col>
          <Col span={10}>
            <label className="title1">Option 1</label>
            <Input id="option" onChange={this.inputText}></Input>
          </Col>
        </Col><br /><br /><br />
        <Col span={24}>
          <Col span={1}></Col>
          <Col span={10}>
            <label className="title1">Product Line</label>
            <Input id="product_line" onChange={this.inputText}></Input>
          </Col>
          <Col span={1}></Col>
          <Col span={10}>
            <label className="title1">Product Description</label>
            <Input id="product_description" onChange={this.inputText}></Input>
          </Col>
        </Col><br /><br /><br />
        <Col span={24}>
          <Col span={1}></Col>
          ` <Col span={10}>
            <label className="title1">Internet Embargo Ad Date</label>
            <Datepicker id="embargo_date" defaultValue={false} width={230} size={"large"} action={this.pickDate} />
          </Col>
          <Col span={1}></Col>
          <Col span={10}>
            <label className="title1">Ad Embargo Date</label>
            <Datepicker id="ad_date" defaultValue={false} size={"large"} width={230} action={this.pickDate} />
          </Col>
        </Col><br /><br /><br /><br />
        <Col span={24} style={{ marginTop: "-0.5em" }}>
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
      html: template[0],
      modalButton1: 'Add',
      modalButton2: 'Cancel',
      sku: '',
      option: '',
      product_line: '',
      product_description: '',
      embargo_date: '',
      ad_date: '',
      derivative_list: ''
    })
  }

  handleOk = () => {
    let flag = false;
    if (this.state.email !== "") {
      let result = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email);
      if (result === false) {
        this.setState({
          showModal: true,
          missingMessage: " ** Please Enter a valid Email ID."
        })
        if (this.state.contact === "Internal" && this.state.email.split("@")[1].split('.')[0] !== "hp") {
          this.setState({
            showModal: true,
            missingMessage: " ** Please Enter a valid Internal Email ID."
          })
        }
        else if (this.state.contact === "External" && this.state.email.split("@")[1].split('.')[0] === "hp") {
          this.setState({
            showModal: true,
            missingMessage: " ** Please Enter a valid External Email ID."
          })
        }
      }
      else if (result) {
        if (this.state.contact === "Internal" && this.state.email.split("@")[1].split('.')[0] !== "hp") {
          this.setState({
            showModal: true,
            missingMessage: " ** Please Enter a valid Internal Email ID."
          })
        }
        else if (this.state.contact === "External" && this.state.email.split("@")[1].split('.')[0] === "hp") {
          this.setState({
            showModal: true,
            missingMessage: " ** Please Enter a valid External Email ID."
          })
        }
        else if (this.state.derivative === "Mainstream" && this.state.accountValue.length !== 0) {
          this.setState({
            showModal: true,
            missingMessage: " ** An account can be associated only with SKU Type as 'Derivative'."
          })
        }
        else if (this.state.derivative === "Derivative" && this.state.accountValue.length === 0) {
          this.setState({
            showModal: true,
            missingMessage: " ** For SKU Type as 'Derivative'. Please add an account(s)."
          })
        }
        else {
          return new Promise((resolve, reject) => {
            axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/addContactList',
              {
                "contact_type": this.state.contact,
                "first_name": this.state.firstName,
                "last_name": this.state.lastName,
                "company": this.state.company,
                "email_address": this.state.email,
                "job_title": this.state.jobtitle,
                "derivative_list": this.state.accountValue,
                "derivative_type": this.state.derivative,
                "receives_masterFile": this.state.receives_masterlife.toString(),
              })
              .then(response => {
                if (response.status === 200) {
                  this.setState({
                    visible: false,
                    dataRecevied: false,
                    firstName: '',
                    lastName: '',
                    email: '',
                    jobtitle: '',
                    company: '',
                    contact: '',
                    derivative: '',
                    showModal: false,
                    accountValue: []
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
        return new Promise((resolve, reject) => {
          axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/addContactList ',
            {
              "contact_type": this.state.contact,
              "first_name": this.state.firstName,
              "last_name": this.state.lastName,
              "company": this.state.company,
              "email_address": this.state.email,
              "job_title": this.state.jobtitle,
              "derivative_list": this.state.accountValue,
              "derivative_type": this.state.derivative,
              "receives_masterFile": this.state.receives_masterlife.toString(),
            })
            .then(response => {
              if (response.status === 200) {
                this.setState({
                  visible: false,
                  dataRecevied: false,
                  firstName: '',
                  lastName: '',
                  email: '',
                  jobtitle: '',
                  company: '',
                  contact: '',
                  derivative: '',
                  accountValue: [],
                  showModal: false
                }, () => this.componentDidMount())
              }
            })
            .catch(function (error) {
              if (error.response.data.message !== "") {
                flag = true;
              }
              else {
                message.error('Server is Down. Please try Later!');
              }
            })
            .finally(() => {
              if (flag)
                this.setState({ missingMessage: '** Invalid Email Address' })
            });
        })
      }
    }
    else {
      emailStyle = {
        width: "105%",
        marginLeft: "-2em",
        border: "1px solid red"
      }
      this.setState({
        showModal: true,
        missingMessage: '** Email is a Mandatory Field'
      })
    }
  }

  submit = () => {
    let data = this.state.backupData;
    let updatedDownloadData = [];
    let arr1;
    if (flagName === false) {
      if (this.state.name != "") {
        if (this.state.name.split(' ').length < 2) {
          arr1 = data.filter(d =>
            //d["firstName"].toString().toLowerCase()+ " " +d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase()
            d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1
          );
        }
        else if (this.state.name.split(' ').length === 2) {
          arr1 = data.filter(d =>
            d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase()
          );
        }
      
        this.setState({
          data: arr1,
          downloadData: arr1
        })
      }
      flagName = true;
      flagCompany = false;
      flagContact = false;
      flagDerivative = false;
      flagMaster = false;
    }
    if (flagContact === false) {
      if (this.state.contact != "") {
        // let temp = "GJ"
        const arr1 = data.filter(d =>
          d["contact_type"].toString().toLowerCase() === this.state.contact.toLocaleLowerCase()
        );
        // updatedDownloadData = arr1;
        // if (updatedDownloadData.length !== 0) {
        //   updatedDownloadData.map((key) => {
        //     delete key.key
        //   })
        // }
        this.setState({
          data: arr1,
          downloadData: arr1
        })
      }
      flagName = false;
      flagCompany = false;
      flagContact = true;
      flagDerivative = false;
      flagMaster = false;
    }
    if (flagCompany === false) {
      if (this.state.company != "") {
        arr1 = data.filter(d =>
          d["company"].toString().toLowerCase().indexOf(this.state.company.toLocaleLowerCase()) > -1
        );
        // updatedDownloadData = arr1;
        // if (updatedDownloadData.length !== 0) {
        //   updatedDownloadData.map((key) => {
        //     delete key.key
        //   })
        // }
        this.setState({
          data: arr1,
          downloadData: arr1
        })
      }
      flagName = false;
      flagCompany = true;
      flagContact = false;
      flagDerivative = false;
      flagMaster = false;
    }
    if (flagDerivative === false) {
      if (this.state.derivative_list != "") {
        arr1 = data.filter(d =>
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toLocaleLowerCase()) > -1
        );
        // updatedDownloadData = arr1;
        // if (updatedDownloadData.length !== 0) {
        //   updatedDownloadData.map((key) => {
        //     delete key.key
        //   })
        // }
        this.setState({
          data: arr1,
          downloadData: arr1
        })
      }
      flagName = false;
      flagCompany = false;
      flagContact = false;
      flagDerivative = true;
      flagMaster = false;
    }
    if (flagMaster === false) {
      if (this.state.masterlife != "") {
        arr1 = data.filter(d =>
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
        );
        // updatedDownloadData = arr1;
        // if (updatedDownloadData.length !== 0) {
        //   updatedDownloadData.map((key) => {
        //     delete key.key
        //   })
        // }
        this.setState({
          data: arr1,
          downloadData: arr1
        })
      }
      flagName = false;
      flagCompany = false;
      flagContact = false;
      flagDerivative = false;
      flagMaster = true;
    }
    if (this.state.name !== "" && this.state.contact !== "") {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["contact_type"].toString().toLowerCase() === this.state.contact.toLocaleLowerCase()
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() &&
          d["contact_type"].toString().toLowerCase() === this.state.contact.toLocaleLowerCase()
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.company !== "") {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["company"].toString().toLowerCase().indexOf(this.state.company.toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() &&
          d["company"].toString().toLowerCase().indexOf(this.state.company.toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.derivative_list !== "") {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["derivative"].toString().toLowerCase() === this.state.derivative_list.toLocaleLowerCase()
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() &&
          d["derivative"].toString().toLowerCase() === this.state.derivative_list.toLocaleLowerCase()
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.masterlife !== "") {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() ||
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.contact !== "" && this.state.company !== "") {
      arr1 = data.filter(d =>
        d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
        d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.contact !== "" && this.state.derivative_list !== "") {
      arr1 = data.filter(d =>
        d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
        d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.contact !== "" && this.state.masterlife !== "") {
      arr1 = data.filter(d =>
        d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.company !== "" && this.state.derivative_list !== "") {
      arr1 = data.filter(d =>
        d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1 &&
        d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.company !== "" && this.state.masterlife !== "") {
      arr1 = data.filter(d =>
        d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.derivative_list !== "" && this.state.masterlife !== "") {
      arr1 = data.filter(d =>
        d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.contact !== "" && this.state.company) {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() ||
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.contact !== "" && this.state.derivative_list) {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() ||
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.derivative_list !== "" && this.state.company) {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["derivative"].toString().toLowerCase() === this.state.derivative_list.toLocaleLowerCase() &&
          d["company"].toString().toLocaleLowerCase().indexOf(this.state.company.toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() ||
          d["derivative"].toString().toLowerCase() === this.state.derivative_list.toLocaleLowerCase() &&
          d["company"].toString().toLocaleLowerCase().indexOf(this.state.company.toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.contact !== "" && this.state.masterlife) {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() ||
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.derivative_list !== "" && this.state.contact !== "" && this.state.company) {
      arr1 = data.filter(d =>
        d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toLocaleLowerCase()) > -1 &&
        d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
        d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.masterlife !== "" && this.state.contact !== "" && this.state.company !== "") {
      arr1 = data.filter(d =>
        d["company"].toString().toLowerCase().indexOf(this.state.company.toLocaleLowerCase()) > -1 &&
        d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.derivative_list !== "" && this.state.masterlife !== "" && this.state.company !== "") {
      arr1 = data.filter(d =>
        d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1 &&
        d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.derivative_list !== "" && this.state.masterlife !== "" && this.state.contact !== "") {
      arr1 = data.filter(d =>
        d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1 &&
        d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.contact !== "" && this.state.company !== "" && this.state.derivative_list !== "") {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1 &&
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1 &&
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.contact !== "" && this.state.company && this.state.derivative_list && this.state.masterlife !== "") {
      arr1 = data.filter(d =>
        d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
        d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1 &&
        d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1 &&
        d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1
      );
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.contact !== "" && this.state.masterlife && this.state.derivative_list !== "") {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1 &&
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1 &&
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name !== "" && this.state.contact !== "" && this.state.company !== "" && this.state.masterlife && this.state.derivative_list !== "") {
      if (this.state.name.split(' ').length < 2) {
        arr1 = data.filter(d =>
          (d["firstName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1 ||
            d["lastName"].toString().toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) > -1) &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1 &&
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1 &&
          d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1
        );
      }
      else if (this.state.name.split(' ').length === 2) {
        arr1 = data.filter(d =>
          d["firstName"].toString().toLowerCase() + " " + d["lastName"].toString().toLowerCase() === this.state.name.toLocaleLowerCase() &&
          d["contact_type"].toString().toLowerCase().indexOf(this.state.contact.toString().toLocaleLowerCase()) > -1 &&
          d["derivative_list"].toString().toLowerCase().indexOf(this.state.masterlife.toString().toLocaleLowerCase()) > -1 &&
          d["derivative"].toString().toLowerCase().indexOf(this.state.derivative_list.toString().toLocaleLowerCase()) > -1 &&
          d["company"].toString().toLowerCase().indexOf(this.state.company.toString().toLocaleLowerCase()) > -1
        );
      }
      // updatedDownloadData = arr1;
      // if (updatedDownloadData.length !== 0) {
      //   updatedDownloadData.map((key) => {
      //     delete key.key
      //   })
      // }
      this.setState({
        data: arr1,
        downloadData: arr1
      })
    }
    if (this.state.name === "" && this.state.contact === "" && this.state.company === "" && this.state.derivative_list === "" && this.state.masterlife === "") {
      this.setState({
        data: data,
        downloadData: data
      })
    }

  }

  refresh = () => {
    let refreshData = this.state.backupData;
    this.setState({
      name: '',
      company: '',
      data: refreshData,
      derivative_list: '',
      contact: '',
      masterlife: []
    })
  }

  addNew = () => {
    emailStyle = {
      width: "105%",
      marginLeft: "-2em"
    }
    this.setState({
      visible: true,
      showFlag: 'none',
      show: false,
      contact: '',
      company: '',
    })
  }
  
  handleCancel = () => {
    emailStyle = {
      width: "105%",
      marginLeft: "-2em"
    }
    this.setState({
      visible: false,
      show: false,
      showModal: false,
      firstName: '',
      lastName: '',
      email: '',
      jobtitle: '',
      company: '',
      contact: '',
      derivative: '',
      accountValue: []
    })
  }

  onSelectChange = selectedRowKeys => {
    console.log(this.state);
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys, checked: false });
  };

  openNotification = () => {
    const args = {
      message: 'Email Sent Successfully.',
      duration: 3,
      icon: <Icon type="info-circle" style={{ color: '#0095d9' }} />
    };
    notification.open(args);
  };

  sendLetter = () => {
    if (typeof (this.state.selectedRowKeys[0]) === 'object') {
      this.state.selectedRowKeys.splice(0, 1);
    }
    if (this.state.selectedRowKeys.length !== 0) {
      this.setState({ loading: true })
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/sendmail', this.state.selectedRowKeys)
          .then(response => {
            if (response.status === 200) {
              this.openNotification();
              this.setState({
                dataRecieved: false,
                loading: false
              }, () => this.componentDidMount())
            }
          })
          .catch(function (error) {
            message.error('Server is down! Please try again later.');
          })
      })
    }
    else {
      const newData = this.state.data.filter(d =>
        d["email_send_status"] === "true"
      );
      let emailSent = [], withHeldData = [];
      emailSent.push(this.state.selectedRowKeys);
      emailSent[0].push(newData);
      emailSent[0][0].map((data) => {
        withHeldData.push(data.email);
      })
      this.setState({ loading: true })
      return new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_DOMAIN+'/capricing/api/sendmail', withHeldData)
          .then(response => {
            if (response.status === 200) {
              this.openNotification();
              this.setState({
                dataRecieved: false,
                loading: false
              }, () => this.componentDidMount())
            }
          })
          .catch(function (error) {
            message.error('Server is down! Please try again later.');
          })
      })
    }
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
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      // getCheckboxProps: (record, even) => ({
      //   defaultChecked: record.email_send_status === "true" ? this.state.checked : false// Column configuration not to be checked
      // }),
    };

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
        <Button style={{ color: "#0095d9", marginLeft: "85%", fontWeight: 600 }} onClick={this.addNew}>Add a New Contact</Button>
        <div style={{marginLeft:"-3em" }}>
          <Collapse bordered style={{ marginLeft: "3.5%", marginRight: "3.5%" }}>
            <Panel header="Contact List Filter" key="1">
              <Col span={24}>
                <Col span={1}></Col>
                <Col span={3}><label className="title1">Name</label></Col>
                <Col span={3}><Input allowClear id="name" onChange={this.inputText} value={this.state.name} ></Input></Col>
                <Col span={1}></Col>
                <Col span={4} style={{ marginLeft: "1.7em" }}><label className="title1">Contact Type</label></Col>
                <Col span={4}><Dropdown data={dropdownData} placeholder={"Select Contact..."} select={this.select} id="contact" value={this.state.contact} /></Col>
                <Col span={1}></Col>
                <Col span={2} style={{ marginLeft: "-1.8em" }}><label className="title1">Company</label></Col>
                <Col span={3}><Input allowClear id="company" onChange={this.inputText} value={this.state.company}></Input></Col>
              </Col><br /><br />
              <Col span={24}>
                <Col span={1}></Col>
                <Col span={3}><label className="title1">Derivative Type</label></Col>
                <Col span={3} style={{ marginLeft: "1.8em" }}><Dropdown data={derivativeList} placeholder={"Select Type..."} select={this.select} value={this.state.derivative_list} id="derivative_list" width={150} /></Col>
                <Col span={1}></Col>
                <Col span={3}><label className="title1">Derivative List</label></Col>
                <Col span={4} style={{ marginLeft: "1em" }}><MultipleSelect dataOptions={multiData} placeholder={"Select Accounts..."} width={200} multipleSelect={this.multipleSelectfilter} id="masterLife" allowClear value={this.state.masterlife} /></Col>
                <Col span={4} style={{ marginLeft: "-1.8em" }}></Col>
                <Col span={1}></Col>
                <Col span={2} style={{ marginTop: "0.3em", marginLeft: "-10em" }}>
                  <Col span={3}><Button type="primary" onClick={this.submit} style={{ marginTop: "-1em" }} icon="search">Search</Button></Col>
                </Col>
                <Col span={2} style={{ marginTop: "0.4em", marginLeft: "-3em" }}>
                  <Tooltip placement="right" title="Refresh"><span style={{ color: "#0095d9", fontSize: "16px", cursor: "pointer", marginLeft: "1em" }} onClick={this.refresh}>Clear All</span></Tooltip>
                </Col>
              </Col><br /><br />
            </Panel>
          </Collapse>
          <Row>
            <Col span={24} style={{ marginTop: "1em" }}>
              <Col span={1}></Col>
              <Col span={3}><label className="title1">MAP MRP Contact List</label></Col>
              <Col span={17}></Col>
              <Col span={3}><Download data={this.state.downloadData} /></Col>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={22} style={{ marginTop: "1em" }}><MissingField show={this.state.show} message={this.state.missingMessage} /></Col>
            </Col>
          </Row>
        </div>
        <div style={{ margin: "3em", marginTop: "1em", backgroundColor: "#fff" }}>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              bordered
              dataSource={this.state.data}
              columns={columns}
              rowSelection={rowSelection}
              rowClassName="editable-row"
              pagination={{
                pageSize: 100
              }}
              style={{marginLeft:"-3em" }}
              onRow={(record) => ({ onClick: () => { rowIndex(record); } })}
            // rowClassName={(record, index) => record.job_title === 'Print Target' ? 'rowStyle' : '' }
            />
          </EditableContext.Provider>
          {/* <ModalClass template={this.state.html} visible={this.state.visible} width={600} cancel={this.handleCancel} submit={this.submit} buttonValue1={this.state.modalButton1} buttonValue2={this.state.modalButton2} /> */}
          <Col span={24}>
            <Col span={3} style={{ marginTop: "-3.5em" }}><Button type="primary" style={{ width: "70%" }} onClick={this.sendLetter} loading={this.state.loading}> Send Email </Button></Col>
            <Col span={21}></Col>
          </Col>
        </div>
        <Modal
          closable={false}
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
            <Col span={24}>
              <MissingField show={this.state.showModal} message={this.state.missingMessage} />
            </Col>
            <div>
              <Col span={24} style={{ marginTop: "0.5em" }}>
                <label className="title2">Add a New Contact</label>
              </Col>
              <Col span={24} style={{ marginTop: "1em" }}>
                <Col span={5}><label className="title1">First Name<span style={{ color: "red" }}></span></label></Col>
                <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%", marginLeft: "-2em" }} id="firstName" value={this.state.firstName} /></Col>
                <Col span={1}></Col>
                <Col span={5}><label className="title1">Last Name<span style={{ color: "red" }}></span></label></Col>
                <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%", marginLeft: "-2em" }} id="lastName" value={this.state.lastName} /></Col>
              </Col>
              <br /><br />
              <Col span={24} style={{ marginTop: "1em" }}>
                <Col span={5}><label className="title1">Derivative Type<span style={{ color: "red" }}></span></label></Col>
                <Col span={5}><Dropdown data={derivativeList} placeholder="Select Type" select={this.select} id="derivativeList" value={this.state.derivative} /></Col>
                <Col span={1}></Col>
                <Col span={13} style={{ display: this.state.showFlag }}>
                  <MultipleSelect dataOptions={multiData} placeholder={"Select Account..."} width={270} multipleSelect={this.multipleSelect} value={this.state.accountValue} />
                </Col>
                <Col span={1}></Col>
              </Col>
              <br /><br />
              <Col span={24} style={{ marginTop: "1em" }}>
                <Col span={5}><label className="title1">Contact Type<span style={{ color: "red" }}></span></label></Col>
                <Col span={5}><Dropdown data={dropdownData} placeholder="Select Contact" select={this.select} id="contact" value={this.state.contact} /></Col>
                <Col span={1}></Col>
                <Col span={5}><label className="title1">Email ID<span style={{ color: "red" }}>*</span></label></Col>
                <Col span={5}><Input allowClear type="email" onChange={this.text} style={emailStyle} id="email" value={this.state.email} /></Col>
              </Col>
              <br /> <br />
              <Col span={24} style={{ marginTop: "1em" }}>
                <Col span={5}><label className="title1">Job Title</label></Col>
                <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%", marginLeft: "-2em" }} id="jobtitle" value={this.state.jobtitle} /></Col>
                <Col span={1}></Col>
                <Col span={5}><label className="title1">Company<span style={{ color: "red" }}></span></label></Col>
                <Col span={5}><Input allowClear type="text" onChange={this.text} style={{ width: "105%", marginLeft: "-2em" }} id="company" value={this.state.company} /></Col>
              </Col>
              <br /> <br />
              <Col span={24} style={{ marginTop: "1em" }}>
                <Col span={4}><label className="title1">Receives Masterfile</label></Col>
                <Col span={4}><Checkbox onChange={this.text} id="receives_masterfile" value={this.state.receives_masterlife}></Checkbox></Col>
              </Col>
              <br /><br />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
