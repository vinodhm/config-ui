import React, { Component } from 'react';
import axios from 'axios';
import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Navbar, Table, Button } from 'reactstrap';
import './index.css';

const ModalComp = props => {
  console.log(props)
  return (
    <Modal isOpen={props.openStatus} toggle={props.toggleNewPropModal}>
      <ModalHeader toggle={props.toggleNewPropModal}>{props.header}</ModalHeader>
      <ModalBody>
        <FormGroup>
          <label for="application">Application</label>
          <Input id="application" value={props.propData.application} onChange={(e) => {
            props.inputChange(e, 'application', props.modalType)
          }} />
        </FormGroup>
        <FormGroup>
          <label for="profile">Profile</label>
          <Input id="profile" value={props.propData.profile} onChange={(e) => {
            props.inputChange(e, 'profile', props.modalType)
          }} />
        </FormGroup>
        <FormGroup>
          <label for="label">Label</label>
          <Input id="label" value={props.propData.label} onChange={(e) => {
            props.inputChange(e, 'label', props.modalType)

          }} />
        </FormGroup>
        <FormGroup>
          <label for="property">Property</label>
          <Input id="property" value={props.propData.key} onChange={(e) => {
            props.inputChange(e, 'key', props.modalType)

          }} />
        </FormGroup>
        <FormGroup>
          <label for="value">Value</label>
          <Input id="value" value={props.propData.value} onChange={(e) => {
            props.inputChange(e, 'value', props.modalType)

          }} />
          <div style={{ padding: '20px 0 0 30px' }}>
            <Label check>
              <Input type="checkbox" value={props.propData.isEncrypted} onChange={(e) => {
                props.inputChange(e, 'isEncrypted', props.modalType)
              }} />
              <span>Encrypt value</span>
            </Label>
          </div>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props.addMethod}>Add Property</Button>
        <Button color="secondary" onClick={props.toggleNewPropModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}

class App extends Component {

  state = {
    props: [],
    newPropData: {
      application: '',
      profile: '',
      label: '',
      key: '',
      value: '',
      isEncrypted: false
    },
    editPropData: {
      id: '',
      application: '',
      profile: '',
      label: '',
      key: '',
      value: '',
      isEncrypted: false
    },
    newPropModal: false,
    editPropModal: false
  }

  clearNewPropData() {
    let { newPropData } = this.state;
    newPropData.application = '';
    newPropData.profile = '';
    newPropData.label = '';
    newPropData.key = '';
    newPropData.value = '';
    newPropData.isEncrypted = false;
  }

  // componentWillMount(){
  //   axios.get('http://localhost:8888/properties').then((response) => {
  //     this.setState({
  //         props: response.data
  //     })
  //   });
  // }

  trackChanges(e, property, entryType) {
    let { newPropData, editPropData } = this.state;
    if (entryType === "edit") {
      editPropData[property] = e.target.value;
      this.setState({ editPropData })
    }
    else {
      newPropData[property] = e.target.value;
      this.setState({ newPropData })
    }
  }

  toggleNewPropModal() {
    this.setState({
      newPropModal: !this.state.newPropModal
    });
  }

  toggleEditPropModal() {
    this.setState({
      editPropModal: !this.state.editPropModal
    });
  }

  addNewProp() {
    if (this.state.newPropModal.isEncrypted) {
      let { newPropData } = this.state;
      newPropData.value = 'encrypt.' + newPropData.value;
      this.state({ newPropData })
    }
    axios.post('http://localhost:8888/property', this.state.newPropData).then((response) => {
      console.log(" response.status :: " + response.status);
      if (response.status === 200) {
        this.componentWillMount();
        this.clearNewPropData();
        this.setState({ newPropModal: false })
      }
    });
  }
  updateProp() {
    let { id, application, profile, label, key, value } = this.state.editPropData;
    axios.put('http://localhost:8888/property', this.state.editPropData.id, {
      id, application, profile, label, key, value
    }).then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        this.componentWillMount();
        this.clearEditPopData();
        this.setState({ editPropModal: false });
      } else {
        alert("something went wrong !!!!!!!!");
      }
    });
  }

  editProp(id, application, profile, label, key, value, row) {
    console.log(" in edit prop :: application :: " + application, row);
    this.setState({
      editPropData: { id, application, profile, label, key, value }, editPropModal: !this.state.editPropModal
    });
  }

  deleteProp(id) {
    axios.delete('http://localhost:8888/property' + id).then((response) => {
      this.componentWillMount();
    })
  }

  render() {
    let props = this.state.props.map((props, index) => {
      return (
        <tr key={props.id}>
          <td>{props.id}</td>
          <td>{props.application}</td>
          <td>{props.profile}</td>
          <td>{props.label}</td>
          <td>{props.key}</td>
          <td>{props.value}</td>
          <td>
            <Button color="success" size="sm" className="mr-2" onClick={this.editProp.bind(this, props.id, props.application, props.profile, props.label, props.key, props.value, index)}>edit</Button>
            <Button color="danger" size="sm" onClick={this.deleteProp.bind(this.props.id)}>delete</Button>
          </td>
        </tr>
      )
    })
    return (
      <div className="App-container">
        <Navbar color="bg-light">
          <h1 className="title"> Application Configuration Manager</h1>
        </Navbar>
        <div className="add-button">
          <Button color="primary" onClick={this.toggleNewPropModal.bind(this)}>Add Property</Button>
        </div>
        <ModalComp
          openStatus={this.state.newPropModal}
          modalType="new"
          toggleNewPropModal={this.toggleNewPropModal.bind(this)}
          inputChange={this.trackChanges.bind(this)}
          addMethod={this.addNewProp.bind(this)}
          propData={this.state.newPropModal}
          header={'New Application Property'}
        />

        <ModalComp
          openStatus={this.state.editPropModal}
          modalType="edit"
          toggleNewPropModal={this.toggleEditPropModal.bind(this)}
          inputChange={this.trackChanges.bind(this)}
          addMethod={this.updateProp.bind(this)}
          propData={this.state.editPropData}
          header={'Edit Application Property'}
        />
        {/* <Modal isOpen={this.state.newPropModal} toggle={this.toggleNewPropModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewPropModal.bind(this)}>New Application property</ModalHeader>
          <ModalBody>
            <FormGroup>
              <label for="application">Application</label>
              <Input id="application" value={this.state.newPropModal.application} onChange={(e) => {
                let { newPropData } = this.state;
                newPropData.profile = e.target.value;
                this.setState({ newPropData })
              }} />
            </FormGroup>
            <FormGroup>
              <label for="profile">Profile</label>
              <Input id="profile" value={this.state.newPropModal.profile} onChange={(e) => {
                let { newPropData } = this.state;
                newPropData.profile = e.target.value;
                this.setState({ newPropData })
              }} />
            </FormGroup>
            <FormGroup>
              <label for="label">Label</label>
              <Input id="label" value={this.state.newPropModal.label} onChange={(e) => {
                let { newPropData } = this.state;
                newPropData.label = e.target.value;
                this.setState({ newPropData })
              }} />
            </FormGroup>
            <FormGroup>
              <label for="property">Property</label>
              <Input id="property" value={this.state.newPropModal.key} onChange={(e) => {
                let { newPropData } = this.state;
                newPropData.key = e.target.value;
                this.setState({ newPropData })
              }} />
            </FormGroup>
            <FormGroup>
              <label for="value">Value</label>
              <Input id="value" value={this.state.newPropModal.value} onChange={(e) => {
                let { newPropData } = this.state;
                newPropData.value = e.target.value;
                this.setState({ newPropData })
              }} />
              <Label check>
                <span>Encrypt value</span>
                <Input type="checkbox" className="ml-lg-l" value={this.state.newPropData.isEncrypted} onChange={(e) => {
                  let { newPropData } = this.state;
                  newPropData.isEncrypted = e.target.checked;
                  console.log("newPropData.isEncrypted ::: " + newPropData.isEncrypted);
                  this.setState({ newPropData })
                }}
                />
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addNewProp.bind(this)}>Add Property</Button>
            <Button color="secondary" onClick={this.toggleNewPropModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal> */}
        {/* <Modal isOpen={this.state.editPropModal} toggle={this.toggleEditPropModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditPropModal.bind(this)}>Edit Application property</ModalHeader>
          <ModalBody>
            <FormGroup>
              <label for="application">Application</label>
              <Input id="application" value={this.state.editPropModal.application} onChange={(e) => {
                let { editPropData } = this.state;
                editPropData.profile = e.target.value;
                this.setState({ editPropData })
              }} />
            </FormGroup>
            <FormGroup>
              <label for="profile">Profile</label>
              <Input id="profile" value={this.state.editPropModal.profile} onChange={(e) => {
                let { editPropData } = this.state;
                editPropData.profile = e.target.value;
                this.setState({ editPropData })
              }} />
            </FormGroup>
            <FormGroup>
              <label for="label">Label</label>
              <Input id="label" value={this.state.editPropModal.label} onChange={(e) => {
                let { editPropData } = this.state;
                editPropData.label = e.target.value;
                this.setState({ editPropData })
              }} />
            </FormGroup>
            <FormGroup>
              <label for="property">Property</label>
              <Input id="property" value={this.state.editPropModal.key} onChange={(e) => {
                let { editPropData } = this.state;
                editPropData.key = e.target.value;
                this.setState({ editPropData })
              }} />
            </FormGroup>
            <FormGroup>
              <label for="value">Value</label>
              <Input id="value" value={this.state.editPropModal.value} onChange={(e) => {
                let { editPropData } = this.state;
                editPropData.value = e.target.value;
                this.setState({ editPropData })
              }} />
              <Label check>
                <span>Encrypt value</span>
                <Input type="checkbox" className="ml-lg-l" value={this.state.editPropData.isEncrypted} onChange={(e) => {
                  let { editPropData } = this.state;
                  editPropData.isEncrypted = e.target.checked;
                  console.log("editPropData.isEncrypted ::: " + editPropData.isEncrypted);
                  this.setState({ editPropData })
                }}
                />
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateProp.bind(this)}>Add Property</Button>
            <Button color="secondary" onClick={this.toggleEditPropModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal> */}
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Application</th>
              <th>Environment</th>
              <th>Label</th>
              <th>Property</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {props}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
