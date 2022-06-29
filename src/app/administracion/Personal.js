import React, { Component } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

import { PDFDownloadLink } from '@react-pdf/renderer'
import ActivoReport from '../reportes/ActivoReport'
import ActivoReturn from '../reportes/ActivoReturn'
import ActivoReporte from '../reportes/ActivoReporte'
import TransferActives from './activo/transferActives';
import { Views } from '../../views/Views';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

export class Personal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuth: '',
      nombre: '',
      password: '',
      confirmPassword: '',
      role: '',
      username: '',
      apPaterno: '',
      apMaterno: '',
      ci: '',
      cargo: '',
      email: '',
      celular: '',
      oficinaId: '',
      cityId: '',
      estado: '',
      error: '',
      id: '',
      data: null,
      searchUser: '',
      oficinas: null,
      request: 'false',
      viewId: Views.personal,
      permissions: null,
      changeToEdit: false,
      roles: null,
      cargos: null,
      isWillBeTransfer: true,
    }
    // Register User
    this.handleNombre = this.handleNombre.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleRole = this.handleRole.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
    this.handleApPaterno = this.handleApPaterno.bind(this)
    this.handleApMaterno = this.handleApMaterno.bind(this)
    this.handleCi = this.handleCi.bind(this)
    this.handleCargo = this.handleCargo.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handleCelular = this.handleCelular.bind(this)
    this.handleOficinaId = this.handleOficinaId.bind(this)
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this)
    this.handleCityId = this.handleCityId.bind(this);

    // Form Handler acciones de botones
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.modifyUser = this.modifyUser.bind(this)

    this.changeEstado = this.changeEstado.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.registerUser = this.registerUser.bind(this)
    this.getOficinas = this.getOficinas.bind(this)
  }

  handleNombre(event) {
    this.setState({ nombre: event.target.value })
  }

  handlePassword(event) {
    this.setState({ password: event.target.value })
  }

  handleRole(event) {
    this.setState({ role: event.target.value })
  }

  handleUsername(event) {
    this.setState({ username: event.target.value })
  }

  handleApPaterno(event) {
    this.setState({ apPaterno: event.target.value })
  }

  handleApMaterno(event) {
    this.setState({ apMaterno: event.target.value })
  }

  handleCi(event) {
    this.setState({ ci: event.target.value })
  }

  handleCargo(event) {
    console.log(event.target.value)
    this.setState({ cargo: event.target.value })
  }

  handleEmail(event) {
    this.setState({ email: event.target.value })
  }

  handleCelular(event) {
    this.setState({ celular: event.target.value })
  }

  handleOficinaId(event) {
    this.setState({ oficinaId: event.target.value })
  }

  handleConfirmPassword(event) {
    this.setState({ confirmPassword: event.target.value })
  }

  handleCityId(event) {
    this.setState({ cityId: event.target.value });
  }

  handleRegisterSubmit(event) {
    event.preventDefault();

    var text = document.getElementById('card-title-user').textContent
    if (text === 'Modificar Usuario') {
      const data = {
        nombre: this.state.nombre,
        password: this.state.password,
        role: this.state.role,
        username: this.state.username,
        apPaterno: this.state.apPaterno,
        apMaterno: this.state.apMaterno,
        ci: this.state.ci + "-" + this.state.cityId,
        cargo: this.state.cargo,
        email: this.state.email,
        celular: this.state.celular,
        oficinaId: this.state.oficinaId,
        estado: this.state.estado,
        _id: this.state.id
      }
      const response = async () => {
        await axios.put(nodeapi + `users/${data._id}`, data)
          .then(res => {
            if (res.data.error) {
              if (res.data.error === 11000) {
                if (res.data.errmsg.includes('email')) {
                  this.setState({ error: 'Email Ya en uso' })
                } else {
                  this.setState({ error: 'Nombre de Usuario Ya en uso' })
                }
              } else {
                this.setState({ error: res.data.error })
              }
            } else {
              console.log(res.data.msg)
              this.setState({ request: 'true' })
            }
          })
          .catch(err => console.log(err))
      }
      response()
    } else {
      const data = {
        nombre: this.state.nombre,
        password: this.state.password,
        role: this.state.role,
        username: this.state.username,
        apPaterno: this.state.apPaterno,
        apMaterno: this.state.apMaterno,
        ci: this.state.ci + "-" + this.state.cityId,
        cargo: this.state.cargo,
        email: this.state.email,
        celular: this.state.celular,
        oficinaId: this.state.oficinaId,
        estado: 'activo',
      }
      const response = async () => {
        await axios.post(nodeapi + 'users', data)
          .then(res => {
            if (res.data.error) {
              if (res.data.error === 11000) {
                if (res.data.errmsg.includes('email')) {
                  this.setState({ error: 'Email Ya en uso' })
                } else {
                  this.setState({ error: 'Nombre de Usuario Ya en uso' })
                }
              } else {
                this.setState({ error: res.data.error })
              }
            } else {
              console.log(res.data.msg)
              this.setState({ request: 'true' })
            }
          })
          .catch(err => console.log(err))
      }
      if (this.state.confirmPassword === this.state.password) {
        response()
      } else {
        this.setState({ error: 'Las contraseñas no coinciden' })
      }
    }
  }

  handleReset(event) {
    document.getElementById('inputRole').value = ''
    // document.getElementById('inputCargo').value = ''
    document.getElementById('inputNombre').value = ''
    document.getElementById('inputPassword').value = ''
    document.getElementById('inputUsername').value = ''
    document.getElementById('inputApPaterno').value = ''
    document.getElementById('inputApMaterno').value = ''
    document.getElementById('inputCi').value = ''
    document.getElementById('inputCargo').value = ''
    document.getElementById('inputEmail').value = ''
    document.getElementById('inputCelular').value = ''
    document.getElementById('inputOficinaId').value = ''

    event.preventDefault()
  }

  checkToken() {
    const token = window.localStorage.getItem('token')
    if (token) {
      this.verifytoken()
    } else {
      this.props.history.push('/login')
    }
  }

  async verifytoken() {
    const data = {
      token: window.localStorage.getItem('token')
    }
    if (data.token) {
      await axios.post(nodeapi + 'users/verify', data)
        .then(async res => {
          if (res.data.status === 'ok') {
            const roleId = this.decodeToken(data.token).role;
            await this.getPermissions(roleId, this.state.viewId);
            if (!this.state.permissions.isVisible) {
              this.props.history.push('/');
            }
            this.setState({ isAuth: 'correct' });
          } else {
            window.localStorage.removeItem('token')
            this.setState({ isAuth: 'failed' })
            this.props.history.push('/login')
          }

          this.getRoles();
        })
        .catch(err => err)
    }
  }

  async getRoles() {
    const roles = await axios.get(`${nodeapi}roles`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            roles: res.data
          });
        }
      })

    return roles
  }

  async getPermissions(roleId, viewId) {
    const permission = await axios.get(`${nodeapi}roleviews/find`, {
      params: {
        roleId,
        viewId
      }
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            permissions: res.data
          });
        }
      })

    return permission
  }

  decodeToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  componentDidMount() {
    this.checkToken()
    this.getData()
    this.getOficinas()
    this.getCargos();
  }

  getData() {
    const response = async () => {
      await axios.get(nodeapi + 'users')
        .then(res => this.setState({ data: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  //crud
  modifyUser(event, data) {
    event.preventDefault()

    this.setState({
      id: data._id,
      estado: data.estado,
      nombre: data.nombre,
      role: data.role,
      cargo: data.cargo,
      username: data.username,
      apPaterno: data.apPaterno,
      apMaterno: data.apMaterno,
      ci: data.ci,
      email: data.email,
      celular: data.celular,
      oficinaId: data.oficinaId,
      changeToEdit: !this.state.changeToEdit,
    }
      , () => {
        document.getElementById('inputRole').value = data.role
        // document.getElementById('inputCargo').value = data.cargo
        document.getElementById('inputNombre').value = data.nombre
        document.getElementById('inputUsername').value = data.username
        document.getElementById('inputApPaterno').value = data.apPaterno
        document.getElementById('inputApMaterno').value = data.apMaterno
        document.getElementById('inputCi').value = data.ci
        // document.getElementById('inputCargo').value = data.cargo
        document.getElementById('inputEmail').value = data.email
        document.getElementById('inputCelular').value = data.celular
        document.getElementById('inputOficinaId').value = data.oficinaId

        document.getElementById('inputEmail').disabled = true
        document.getElementById('inputUsername').disabled = true
        document.getElementById('inputUsername').disabled = true

        document.getElementById('card-title-user').innerHTML = 'Modificar Usuario'
        document.getElementById('card-title-user').style = 'color: red'
      })
  }

  changeEstado(event, datax) {
    const data = {
      estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
      _id: datax._id
    }
    const response = async () => {
      await axios.put(nodeapi + `users/${data._id}/estado`, data)
        .then(res => {
          console.log(res.data)
          this.getData();
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
  }

  handleTransferActive(event) {
    this.setState({ isWillBeTransfer: !this.state.isWillBeTransfer });

    event.preventDefault();
  }

  deleteUser(event, datax) {
    const data = {
      _id: datax._id
    }
    const response = async () => {
      await axios.delete(nodeapi + `users/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  registerUser(event) {
    document.getElementById('inputRole').value = ''
    document.getElementById('inputOficinaId').value = ''
    document.getElementById('inputNombre').value = ''
    document.getElementById('inputUsername').value = ''
    document.getElementById('inputApPaterno').value = ''
    document.getElementById('inputApMaterno').value = ''
    document.getElementById('inputCi').value = ''
    // document.getElementById('inputCargo').value = ''
    document.getElementById('inputEmail').value = ''
    document.getElementById('inputCelular').value = ''
    document.getElementById('inputOficinaId').value = ''

    document.getElementById('inputEmail').disabled = false
    document.getElementById('inputUsername').disabled = false
    document.getElementById('inputUsername').disabled = false

    document.getElementById('card-title-user').innerHTML = 'Registrar Usuario'
    document.getElementById('card-title-user').style = 'color: black'
    event.preventDefault()
  }

  getOficinas() {
    const response = async () => {
      await axios.get(nodeapi + 'oficinas')
        .then(res => this.setState({ oficinas: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  getCargos() {
    const response = async () => {
      await axios.get(`${nodeapi}cargos`)
        .then(res => this.setState({ cargos: res.data }))
        .catch(err => console.log(err));
    }

    response();
  }

  render() {
    // const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }

    if (this.state.request === 'true') {
      window.location.reload()
    }

    if (this.state.isAuth === '') {
      return null
    } else {
      if (this.state.isAuth === 'failed') {
        return (
          <Redirect to={{ pathname: '/login' }} />
        )
      }
      else {
        return (
          <Element
            id="containerElement"
            style={{
              height: "800px",
              overflow: "scroll",
            }}
          >
            <div>
              <div className="page-header">
                <h3 className="page-title"> Personal </h3>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Personal</li>
                  </ol>
                </nav>
              </div>
              <div className="row">
                <div className="col-lg-6 grid-margin stretch-card" style={{ marginBottom: '0px' }}>
                  <div className="form-group" style={{ width: '100%' }}>
                    <input type="search" className="form-control" placeholder="Buscar" onChange={(event) => this.setState({ searchUser: event.target.value })} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title">Lista de Personal - Usuarios</h4>
                      {/* <p className="card-description"> Add className <code>.table-hover</code>
                          </p> */}
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Nombre</th>
                              <th>Ap. Paterno</th>
                              <th>Ap. Materno</th>
                              {/* <th>Usuario</th> */}
                              <th>CI</th>
                              <th>Departamento</th>
                              <th>Cargo</th>
                              {/*<th>Email</th>*/}
                              <th>Nro Celular</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.data !== null ?
                                this.state.data
                                  .filter((index) => {
                                    if (this.state.searchUser === '') {
                                      return index
                                    } else {
                                      if (index.nombre.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.apPaterno?.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.apMaterno.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.username.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.cargo.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase())) {
                                        return index
                                      }
                                    }
                                    return null
                                  })
                                  .map((index, key) => (
                                    <tr key={key}>
                                      <td>{index.nombre}</td>
                                      <td>{index.apPaterno}</td>
                                      <td>{index.apMaterno}</td>
                                      {/* <td>{index.username}</td> */}
                                      <td>{index.ci}</td>
                                      <td>{
                                        this.state.oficinas !== null && this.state.oficinas.find(item => item._id === index.oficinaId) !== undefined ?
                                          this.state.oficinas.find(item => item._id === index.oficinaId).nombre :
                                          null
                                      }</td>
                                      <td>{
                                        this.state.cargos !== null && this.state.cargos.find(item => item._id === index.cargo) !== undefined ?
                                          this.state.cargos.find(item => item._id === index.cargo).name :
                                          null
                                      }</td>
                                      {/*<td>{index.email}</td>*/}
                                      <td>{index.celular}</td>
                                      <td className={index.estado === 'activo' ? 'text-success' : 'text-danger'}>
                                        {index.estado} <i className={index.estado === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
                                      </td>
                                      <td>
                                        <Dropdown>
                                          <Dropdown.Toggle variant="success" id="dropdown-basic"></Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            {
                                              this.state.permissions !== undefined &&
                                              this.state.permissions.isEditable &&
                                              (
                                                <Dropdown.Item
                                                  href="#/action-1"
                                                  onClick={evt => this.modifyUser(evt, index)}>
                                                  <span
                                                    style={{
                                                      fontSize: '14px',
                                                    }}
                                                  >Modificar</span>
                                                </Dropdown.Item>
                                              )
                                            }


                                            {
                                              this.state.permissions !== undefined &&
                                              this.state.permissions.isDeletable &&
                                              (
                                                <Dropdown.Item
                                                  href="#/action-2"
                                                  onClick={evt => this.changeEstado(evt, index)}
                                                >
                                                  <span

                                                    style={{
                                                      fontSize: '14px',
                                                    }}>Mod Estado</span>
                                                </Dropdown.Item>
                                              )
                                            }
                                            <Dropdown.Item href="#/action-3">
                                              <a>
                                                <PDFDownloadLink
                                                  document={<ActivoReport
                                                    data={index}
                                                    token={window.localStorage.getItem('token')}
                                                  />}
                                                  style={{
                                                    color: '#000',
                                                    backgroundColor: 'transparent'
                                                  }}
                                                  fileName={`reporte-usuario-${index.username}`}
                                                >
                                                  Ent. Activos
                                                </PDFDownloadLink>
                                              </a>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">
                                              <a>
                                                <PDFDownloadLink
                                                  document={<ActivoReturn
                                                    data={index}
                                                    token={window.localStorage.getItem('token')}
                                                  />}
                                                  fileName={`reporte-usuario-${index.username}`}
                                                  style={{
                                                    color: '#000',
                                                    backgroundColor: 'transparent'
                                                  }}
                                                >
                                                  Dev. Activos
                                                </PDFDownloadLink>
                                              </a>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">
                                              <a>
                                                {<PDFDownloadLink
                                                  document={<ActivoReporte data={index} />}
                                                  fileName={`reporte-usuario-${index.username}`}
                                                  style={{
                                                    color: '#000',
                                                    backgroundColor: 'transparent'
                                                  }}
                                                >
                                                  Verif. Est. de Activos
                                                </PDFDownloadLink>}
                                              </a>
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                        {/*{<a href="!#" onClick={evt => this.deleteUser(evt, index)} className="badge badge-danger" style={{ marginRight: '3px' }}>Eliminar</a>}*/}
                                      </td>
                                    </tr>
                                  ))
                                : null
                            }
                            {/* <tr>
                                  <td>Messsy</td>
                                  <td>Flash</td>
                                  <td className="text-danger"> 21.06% <i className="mdi mdi-arrow-down"></i></td>
                                </tr>
                                <tr>
                                  <td>John</td>
                                  <td>Premier</td>
                                  <td className="text-danger"> 35.00% <i className="mdi mdi-arrow-down"></i></td>
                                  <td><label className="badge badge-info">Fixed</label></td>
                                </tr>
                                <tr>
                                  <td>Peter</td>
                                  <td>After effects</td>
                                  <td className="text-success"> 82.00% <i className="mdi mdi-arrow-up"></i></td>
                                  <td><label className="badge badge-success">Completed</label></td>
                                </tr>
                                <tr>
                                  <td>Dave</td>
                                  <td>53275535</td>
                                  <td className="text-success"> Activo <i className="mdi mdi-arrow-up"></i></td>
                                  <td><label className="badge badge-warning">In progress</label></td>
                                </tr> */}
                            <tr>
                              {
                                this.state.permissions !== undefined &&
                                this.state.permissions.isAddble &&
                                (
                                  <td>
                                    <Link to="FormActivo" spy={true} smooth={true} duration={250} containerId="containerElement">
                                      <a href="!#" onClick={evt => this.registerUser(evt)} className="badge badge-success" style={{ marginRight: '3px', color: 'whitesmoke' }}>Registrar Nuevo</a>
                                    </Link>
                                  </td>
                                )
                              }
                              {
                                <td>
                                  <Link to="TransferirActivo" spy={true} smooth={true} duration={250} containerId="containerElement">
                                    <a href="!#" onClick={evt => this.handleTransferActive(evt)} className="badge badge-warning" style={{ marginRight: '3px', color: 'whitesmoke' }}>Transferir Activos</a>
                                  </Link>
                                </td>
                              }
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Element name="TransferirActivo">
                {
                  !this.state.isWillBeTransfer ? <TransferActives /> : null
                }
              </Element>
              {
                (this.state.changeToEdit || this.state.permissions.isAddble) &&
                (
                  <Element name="FormActivo">
                    <div className="row">
                      <div className="col-md-9 grid-margin stretch-card">
                        <div className="card">
                          <div className="card-body">
                            <h4 className="card-title" id="card-title-user">Registrar Usuario</h4>
                            <form className="form-sample">
                              <p className="card-description"> Informacion Personal </p>
                              <div className="row">
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Nombre(s)</label>
                                    <div className="col-sm-9">
                                      <Form.Control type="text" id="inputNombre" placeholder="Nombre" required onChange={this.handleNombre} />
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Apellido Paterno</label>
                                    <div className="col-sm-9">
                                      <Form.Control type="text" id="inputApPaterno" placeholder="Ap. paterno" required onChange={this.handleApPaterno} />
                                    </div>
                                  </Form.Group>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Apellido Materno</label>
                                    <div className="col-sm-9">
                                      <Form.Control type="text" id="inputApMaterno" placeholder="Ap Materno" required onChange={this.handleApMaterno} />
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">CI</label>
                                    <div className="col-sm-6">
                                      <Form.Control type="text" placeholder="Ej: 123456pt" required id="inputCi" onChange={this.handleCi} />
                                      {/* <select className="form-control">
                                      <option>Male</option>
                                      <option>Female</option>
                                    </select> */}
                                    </div>
                                    <div className="col-sm-3">
                                      <select className="form-control" onChange={this.handleCityId} required>
                                        <option value={"Lp"}>La Paz</option>
                                        <option value={"Or"}>Oruro</option>
                                        <option value={"Pt"}>Potosi</option>
                                        <option value={"Tj"}>Tarija</option>
                                        <option value={"Ch"}>Chuquisaca</option>
                                        <option value={"Sc"}>Santa Cruz</option>
                                        <option value={"Bn"}>Beni</option>
                                        <option value={"Pa"}>Pando</option>
                                        <option value={"Cb"}>Cochabamba</option>
                                      </select>
                                    </div>
                                  </Form.Group>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Departamento</label>
                                    <div className="col-sm-9">
                                      <select className="form-control" required id="inputOficinaId" onChange={this.handleOficinaId}>
                                        <option hidden value=''>Escoga una Opcion</option>
                                        {
                                          this.state.oficinas !== null ?
                                            this.state.oficinas.map((index, key) => (
                                              <option value={index._id} key={key}>{index.nombre}</option>
                                            ))
                                            : <option>Cargando...</option>
                                        }
                                      </select>
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Cargo</label>
                                    <div className="col-sm-9">
                                      <select className="form-control" required id="inputOficinaId" onChange={this.handleCargo}>
                                        <option hidden value=''>Escoga una Opcion</option>
                                        {
                                          this.state.cargos !== null ?
                                            this.state.cargos.map((index, key) => (
                                              <option value={index._id} key={key}>{index.name}</option>
                                            ))
                                            : <option>Cargando...</option>
                                        }
                                      </select>
                                    </div>
                                  </Form.Group>
                                </div>
                                {/* <div className="col-md-6">
                              <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">Cargo</label>
                                <div className="col-sm-9">
                                  <Form.Control type="text" placeholder="Cargo" id="inputCargo" required onChange={this.handleCargo} />
                                </div>
                              </Form.Group>
                            </div> */}
                              </div>
                              <div className="row">
                                {/* <div className="col-md-6">
                                <Form.Group className="row" id="inputRole" onChange={this.handleRole}>
                                  <label className="col-sm-3 col-form-label">Rol en Sistema</label>
                                  <div className="col-sm-4">
                                  <div className="form-check">
                                    <label className="form-check-label">
                                      <input type="radio" className="form-check-input" name="ExampleRadio4" id="membershipRadios1" defaultChecked value='usuario'/> Usuario 
                                      <i className="input-helper"></i>
                                    </label>
                                  </div>
                                  </div>
                                  <div className="col-sm-5">
                                  <div className="form-check">
                                    <label className="form-check-label">
                                      <input type="radio" className="form-check-input" name="ExampleRadio4" id="membershipRadios2" value='admin'/> Administrador 
                                      <i className="input-helper"></i>
                                    </label>
                                  </div>
                                  </div>
                                </Form.Group>
                              </div> */}
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Rol en Sistema</label>
                                    <div className="col-sm-9">
                                      <select className="form-control" required id="inputRole" onChange={this.handleRole}>
                                        <option hidden value=''>Escoga una Opcion</option>
                                        {
                                          this.state.roles !== null && (
                                            this.state.roles.map((item) => (
                                              <option value={item._id} key={item._id}>{item.name}</option>
                                            ))
                                          )
                                        }
                                      </select>
                                    </div>
                                  </Form.Group>
                                </div>
                              </div>
                              <p className="card-description"> Datos de Usuario </p>
                              <div className="row">
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Email</label>
                                    <div className="col-sm-9">
                                      <Form.Control type="email" placeholder="tuemail@example.com" id="inputEmail" required onChange={this.handleEmail} />
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Nro de Celular</label>
                                    <div className="col-sm-9">
                                      <Form.Control type="text" placeholder="1234-5678" required id="inputCelular" maxlength="8" onChange={this.handleCelular} />
                                    </div>
                                  </Form.Group>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Nombre de Usuario</label>
                                    <div className="col-sm-9">
                                      <Form.Control type="text" placeholder="Nombre de Usuario" id="inputUsername" required onChange={this.handleUsername} />
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="col-md-6">
                                  {/* <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Contraseña</label>
                                  <div className="col-sm-9">
                                  <Form.Control type="text"/>
                                  </div>
                                </Form.Group> */}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Contraseña</label>
                                    <div className="col-sm-9">
                                      <Form.Control type="password" placeholder="Contraseña" id="inputPassword" required onChange={this.handlePassword} />
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="col-md-6">
                                  <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Confirmar Contraseña</label>
                                    <div className="col-sm-9">
                                      <Form.Control type="password" placeholder="Repite la contraseña" id="inputConfirmPassword" required onChange={this.handleConfirmPassword} />
                                    </div>
                                  </Form.Group>
                                </div>
                                <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                                <button className="btn btn-light" onClick={this.handleReset}>Borrar Datos</button>
                                {
                                  this.state.error !== '' ? <label style={{ color: 'red', fontSize: '0.875rem' }}>{this.state.error}</label> : null
                                }
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Element>
                )
              }
            </div>
          </Element>
        )
      }
    }
  }
}

export default Personal
