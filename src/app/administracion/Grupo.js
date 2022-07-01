import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { ProgressBar, Dropdown, Modal } from 'react-bootstrap'
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

import { PDFDownloadLink } from '@react-pdf/renderer'
import GrupoReport from '../reportes/GrupoReport'
import GeneralReport from '../reportes/GeneralReport'

import DepreciacionReport from '../reportes/DepreciacionReport'
import ActualizacionReport from '../reportes/ActualizacionReport'
import { Views } from '../../views/Views';
import { ItemPagination } from './ItemPagination';

export class Grupo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuth: '',
      nombre: '',
      codigo: '',
      coe: '',
      vida: '',
      estado: '',
      error: '',
      id: '',
      data: null,
      searchGrupo: '',
      request: 'false',
      auxiliares: null,
      viewId: Views.grupos,
      permissions: null,
      changeToEdit: false,
      showRegisterModal: false,
      showModifyModal: false,
    }
    // Register User
    this.handleNombre = this.handleNombre.bind(this)
    this.handleCodigo = this.handleCodigo.bind(this)
    this.handleVida = this.handleVida.bind(this)
    this.handleCoe = this.handleCoe.bind(this)

    // Form Handler
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.modifyGrupo = this.modifyGrupo.bind(this)

    this.changeEstado = this.changeEstado.bind(this)
    this.deleteGrupo = this.deleteGrupo.bind(this)
    this.registerGrupo = this.registerGrupo.bind(this)
  }

  handleNombre(event) {
    this.setState({ nombre: event.target.value })
  }

  handleCodigo(event) {
    this.setState({ codigo: event.target.value })
  }

  handleCoe(event) {
    this.setState({ coe: event.target.value })
  }

  handleVida(event) {
    this.setState({ vida: event.target.value })
  }

  handleRegisterSubmit(event) {
    var text = document.getElementById('card-title-grupo').textContent
    if (text === 'Modificar Grupo') {
      const data = {
        nombre: this.state.nombre,
        codigo: this.state.codigo,
        estado: this.state.estado,
        coe: this.state.coe,
        vida: this.state.vida,
        _id: this.state.id
      }
      const response = async () => {
        await axios.put(nodeapi + `grupos/${data._id}`, data)
          .then(res => {
            if (res.data.error) {
              if (res.data.error === 11000) {
                if (res.data.errmsg.includes('codigo')) {
                  this.setState({ error: 'Codigo Ya en uso' })
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
        codigo: this.state.codigo,
        coe: this.state.coe,
        vida: this.state.vida,
        estado: 'activo',
      }
      const response = async () => {
        await axios.post(nodeapi + 'grupos', data)
          .then(res => {
            if (res.data.error) {
              if (res.data.error === 11000) {
                if (res.data.errmsg.includes('codigo')) {
                  this.setState({ error: 'Codigo Ya en uso' })
                } else {
                  this.setState({ error: 'Nombre de Grupo Ya en uso' })
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
    event.preventDefault()
  }

  handleReset(event) {
    // document.getElementById('inputCodigo').value = ''
    document.getElementById('inputNombre').value = ''
    document.getElementById('inputVida').value = ''
    document.getElementById('inputCoe').value = ''

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
        })
        .catch(err => err)
    }
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
    this.getAuxiliares()
  }

  getData() {
    const response = async () => {
      await axios.get(nodeapi + 'grupos')
        .then(res => this.setState({ data: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  //crud
  modifyGrupo(event, data) {
    // document.getElementById('inputCodigo').value = data.codigo
    this.setState({
      id: data._id,
      estado: data.estado,
      nombre: data.nombre,
      codigo: data.codigo,
      vida: data.vida,
      coe: data.coe,
      changeToEdit: !this.state.changeToEdit,
      showModifyModal: true,
    }, () => {
      document.getElementById('inputNombre').value = data.nombre
      document.getElementById('inputVida').value = data.vida
      document.getElementById('inputCoe').value = data.coe

      document.getElementById('card-title-grupo').innerHTML = 'Modificar Grupo'
      document.getElementById('card-title-grupo').style = 'color: red'
    })
    event.preventDefault()
  }

  changeEstado(event, datax) {
    const data = {
      estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
      _id: datax._id
    }
    const response = async () => {
      await axios.put(nodeapi + `grupos/${data._id}/estado`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  deleteGrupo(event, datax) {
    const data = {
      _id: datax._id
    }
    const response = async () => {
      await axios.delete(nodeapi + `grupos/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  registerGrupo(event) {
    this.setState({ showRegisterModal: true });
    event.preventDefault()
  }

  getAuxiliares() {
    const response = async () => {
      await axios.get(nodeapi + `auxiliares`)
        .then(res => {
          this.setState({ auxiliares: res.data })
        })
        .catch(err => console.log(err))
    }

    response()

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
          <div>
            <div className="page-header">
              <h3 className="page-title"> Grupos </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Grupos</li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-lg-9 grid-margin stretch-card" style={{ marginBottom: '0px' }}>
                <div className="row form-group" style={{ width: '100%', marginLeft: '0' }}>
                  <input
                    type="search"
                    className="col-lg-5 form-control"
                    placeholder="Buscar"
                    onChange={(event) => this.setState({ searchGrupo: event.target.value })}
                  />
                  <button
                    type="submit"
                    className="col-lg-2 btn btn-primary mr-2"
                  // onClick={onClickSearchButton}
                  >
                    Buscar
                  </button>
                  {
                    this.state.permissions !== undefined &&
                    this.state.permissions.isAddble &&
                    (
                      <button
                        className='col-lg-2 btn badge-success mr-2'
                        onClick={evt => this.registerGrupo(evt)}
                      >
                        Registrar Nuevo
                      </button>
                    )
                  }
                  {
                    this.state.permissions !== undefined &&
                    this.state.permissions.isEditable &&
                    (
                      <PDFDownloadLink document={<GeneralReport />} fileName={`reporte-general-grupos`} className='col-lg-2 btn badge-warning mr-2' style={{ marginRight: '3px' }}>
                        Rept. General
                      </PDFDownloadLink>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Lista de Grupos</h4>
                    {/* <p className="card-description"> Add className <code>.table-hover</code>
                          </p> */}
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Codigo</th>
                            <th>Vida Útil</th>
                            <th>Cantidad</th>
                            {/*<th>Estado</th>*/}
                            <th>Acciones</th>
                            <th>Reportes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <ItemPagination
                            url={`grupos/all`}
                            ItemComponent={({ item }) => (
                              <tr>
                                <td>{item.nombre}</td>
                                <td>{item.codigo}</td>
                                <td>{item.vida}</td>
                                <td>
                                  {
                                    this.state.auxiliares !== null && this.state.auxiliares.filter(itemz => itemz.grupoId === item._id).length !== undefined ?
                                      <>
                                        <ProgressBar variant="success" max={50} style={{ minWidth: '100px' }} now={this.state.auxiliares.filter(itemz => item.grupoId === itemz._id).length} />
                                        <label style={{ float: 'right', color: '#19d895', fontSize: '13px' }}>{this.state.auxiliares.filter(itemz => item.grupoId === itemz._id).length}</label>
                                      </>
                                      :
                                      null
                                  }
                                </td>
                                {/*<td className={index.estado === 'activo' ? 'text-success' : 'text-danger'}>
                                      {index.estado} <i className={index.estado === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
                                    </td>*/}
                                <td>
                                  <Dropdown>
                                    <Dropdown.Toggle variant="warning" id="dropdown-basic"></Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {
                                        this.state.permissions !== undefined &&
                                        this.state.permissions.isEditable &&
                                        (
                                          <Dropdown.Item
                                            href="#/action-1"
                                            onClick={evt => this.modifyGrupo(evt, item)}>
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
                                            href="#/action-1"
                                            onClick={evt => this.deleteGrupo(evt, item)}>
                                            <span
                                              style={{
                                                fontSize: '14px',
                                              }}
                                            >Eliminar</span>
                                          </Dropdown.Item>
                                        )
                                      }
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </td>
                                <td>
                                  {
                                    this.state.permissions !== undefined &&
                                    this.state.permissions.isEditable &&
                                    (
                                      <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic"></Dropdown.Toggle>
                                        <Dropdown.Menu>
                                          <Dropdown.Item href="#/action-3">
                                            <a>
                                              <PDFDownloadLink
                                                document={<GrupoReport data={item} />}
                                                fileName={`reporte-grupo-${item.nombre}`}
                                                style={{
                                                  color: '#000',
                                                  backgroundColor: 'transparent'
                                                }}>
                                                Rept. Grupal
                                              </PDFDownloadLink>
                                            </a>
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-3">
                                            <a>
                                              <PDFDownloadLink
                                                document={<ActualizacionReport data={item} />}
                                                fileName={`reporte-activo-actualizacion`}
                                                style={{
                                                  color: '#000',
                                                  backgroundColor: 'transparent'
                                                }}>
                                                Rept. Actualizacion
                                              </PDFDownloadLink>
                                            </a>
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-3">
                                            <a>
                                              <PDFDownloadLink
                                                document={<DepreciacionReport data={item} />}
                                                fileName={`reporte-activo-depreciacion`}
                                                style={{
                                                  color: '#000',
                                                  backgroundColor: 'transparent'
                                                }}>
                                                Rept. Depreciacion
                                              </PDFDownloadLink>
                                            </a>
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    )
                                  }
                                </td>
                              </tr>
                            )}
                          />
                          {/* <PDFDownloadLink document={<GrupoReport data={index} />} fileName={`reporte-grupo-${index.nombre}`} className="badge badge-info" style={{ marginRight: '3px' }}>
                              Rept. Grupal
                              {({ blob, url, loading, error }) =>
                                                loading ? 'Cargando...' : 'Reporte'
                                              }
                            </PDFDownloadLink> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              show={this.state.showRegisterModal}
              onHide={() => this.setState({ showRegisterModal: false })}
              centered
            >
              {
                (this.state.changeToEdit || this.state.permissions.isAddble) &&
                (
                  <div className="col-md-12 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title" id="card-title-grupo">Registrar Grupo</h4>
                        <p className="card-description">Todos los campos son requeridos</p>
                        <form className="forms-sample">
                          <Form.Group>
                            <label htmlFor="exampleInputUsername1">Nombre de Grupo</label>
                            <Form.Control onChange={this.handleNombre} type="text" id="inputNombre" placeholder="Nombre del Grupo" size="lg" required />
                          </Form.Group>
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">VIDA</label>
                                <div className="col-sm-9">
                                  <Form.Control type="number" placeholder="En años" step="any" id="inputVida" required onChange={this.handleVida} />
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">COE</label>
                                <div className="col-sm-9">
                                  <Form.Control type="number" placeholder="0% - 100%" step="1" min={1} max={100} id="inputCoe" required onChange={this.handleCoe} />
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                          {/* <Form.Group>
                              <label htmlFor="exampleInputEmail1">Codigo</label>
                              <Form.Control onChange={this.handleCodigo} type="Codigo" className="form-control" id="inputCodigo" placeholder="Codigo" required/>
                            </Form.Group> */}
                          <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                          <button className="btn btn-light" onClick={evt => this.handleReset(evt)}>Borrar Datos</button>
                          {
                            this.state.error !== '' ? <label style={{ color: 'red', fontSize: '0.875rem' }}>{this.state.error}</label> : null
                          }
                        </form>
                      </div>
                    </div>
                  </div>
                )
              }
            </Modal>
            <Modal
              show={this.state.showModifyModal}
              onHide={() => this.setState({ showModifyModal: false })}
              centered
            >
              {
                (this.state.changeToEdit || this.state.permissions.isAddble) &&
                (
                  <div className="col-md-12 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title" id="card-title-grupo">Registrar Grupo</h4>
                        <p className="card-description">Todos los campos son requeridos</p>
                        <form className="forms-sample">
                          <Form.Group>
                            <label htmlFor="exampleInputUsername1">Nombre de Grupo</label>
                            <Form.Control onChange={this.handleNombre} type="text" id="inputNombre" placeholder="Nombre del Grupo" size="lg" required />
                          </Form.Group>
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">VIDA</label>
                                <div className="col-sm-9">
                                  <Form.Control type="number" placeholder="En años" step="any" id="inputVida" required onChange={this.handleVida} />
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">COE</label>
                                <div className="col-sm-9">
                                  <Form.Control type="number" placeholder="0% - 100%" step="1" min={1} max={100} id="inputCoe" required onChange={this.handleCoe} />
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                          {/* <Form.Group>
                              <label htmlFor="exampleInputEmail1">Codigo</label>
                              <Form.Control onChange={this.handleCodigo} type="Codigo" className="form-control" id="inputCodigo" placeholder="Codigo" required/>
                            </Form.Group> */}
                          <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                          <button className="btn btn-light" onClick={evt => this.handleReset(evt)}>Borrar Datos</button>
                          {
                            this.state.error !== '' ? <label style={{ color: 'red', fontSize: '0.875rem' }}>{this.state.error}</label> : null
                          }
                        </form>
                      </div>
                    </div>
                  </div>
                )
              }
            </Modal>
          </div>
        )
      }
    }
  }
}

export default Grupo
