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
      grupoUrl: 'grupos/all'
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

  onClickSearchButton(event) {
    this.setState({grupoUrl: `grupos/search?searchInput=${this.state.searchGrupo}`})
    event.preventDefault();
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
                    onClick={(event) => this.onClickSearchButton(event)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg> Buscar
                  </button>
                  {
                    this.state.permissions !== undefined &&
                    this.state.permissions.isAddble &&
                    (
                      <button
                        className='col-lg-2 btn badge-success mr-2'
                        onClick={evt => this.registerGrupo(evt)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg> Registrar Nuevo
                      </button>
                    )
                  }
                  {
                    this.state.permissions !== undefined &&
                    this.state.permissions.isEditable &&
                    (
                      <PDFDownloadLink document={<GeneralReport />} fileName={`reporte-general-grupos`} className='col-lg-2 btn badge-warning mr-2' style={{ marginRight: '3px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf-fill" viewBox="0 0 16 16">
                          <path d="M5.523 10.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.035 21.035 0 0 0 .5-1.05 11.96 11.96 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.888 3.888 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 4.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z" />
                          <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm.165 11.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.64 11.64 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.707 19.707 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z" />
                        </svg>Rept. General
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
                            url={this.state.grupoUrl}
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
                                    <Dropdown.Toggle variant="success" id="dropdown-basic"></Dropdown.Toggle>
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
                                        <Dropdown.Toggle variant="info" id="dropdown-basic"></Dropdown.Toggle>
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
