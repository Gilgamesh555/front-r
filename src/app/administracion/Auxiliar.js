import React, { Component } from 'react';
import { Form, Dropdown, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'
import { Views } from '../../views/Views';
import { ItemPagination } from './ItemPagination';

export class Auxiliar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuth: '',
      nombre: '',
      codigo: '',
      estado: '',
      descripcion: '',
      grupoId: '',
      error: '',
      id: '',
      data: null,
      grupos: null,
      searchAuxiliar: '',
      request: 'false',
      viewId: Views.auxiliares,
      permissions: null,
      changeToEdit: false,
      showRegisterModal: false,
      showModifyModal: false,
    }
    // Register User
    this.handleNombre = this.handleNombre.bind(this)
    this.handleCodigo = this.handleCodigo.bind(this)
    this.handleDescripcion = this.handleDescripcion.bind(this)
    this.handleGrupoId = this.handleGrupoId.bind(this)

    // Form Handler
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.modifyAuxiliar = this.modifyAuxiliar.bind(this)

    this.changeEstado = this.changeEstado.bind(this)
    this.deleteAuxiliar = this.deleteAuxiliar.bind(this)
    this.registerAuxiliar = this.registerAuxiliar.bind(this)
  }

  handleNombre(event) {
    this.setState({ nombre: event.target.value })
  }

  handleCodigo(event) {
    this.setState({ codigo: event.target.value })
  }

  handleDescripcion(event) {
    this.setState({ descripcion: event.target.value })
  }

  handleGrupoId(event) {
    this.setState({ grupoId: event.target.value })
  }

  handleRegisterSubmit(event) {
    var text = document.getElementById('card-title-auxiliar').textContent
    if (text === 'Modificar Auxiliar') {
      const data = {
        nombre: this.state.nombre,
        codigo: this.state.codigo,
        // descripcion: this.state.descripcion,
        grupoId: this.state.grupoId,
        _id: this.state.id,
        estado: this.state.estado,
      }
      console.log(data)
      const response = async () => {
        await axios.put(nodeapi + `auxiliares/${data._id}`, data)
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
        // codigo: this.state.codigo,
        // descripcion: this.state.descripcion,
        grupoId: this.state.grupoId,
        estado: 'activo',
      }
      const response = async () => {
        await axios.post(nodeapi + 'auxiliares', data)
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
    // document.getElementById('inputDescripcion').value = ''
    document.getElementById('inputGrupoId').value = ''

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
            const roleId = this.decodeToken(data.token).role
            await this.getPermissions(roleId, this.state.viewId);
            if (!this.state.permissions.isVisible) {
              this.props.history.push('/');
            }
            this.setState({ isAuth: 'correct' })
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
    this.getGrupos()
  }

  getData() {
    const response = async () => {
      await axios.get(nodeapi + 'auxiliares')
        .then(res => this.setState({ data: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  //crud
  modifyAuxiliar(event, data) {
    this.setState({
      id: data._id,
      estado: data.estado,
      nombre: data.nombre,
      codigo: data.codigo,
      grupoId: data.grupoId,
      showModifyModal: true,
    }, () => {
      // document.getElementById('inputCodigo').value = data.codigo
      document.getElementById('inputNombre').value = data.nombre
      // document.getElementById('inputDescripcion').value = data.nombre
      document.getElementById('inputGrupoId').value = data.grupoId
      document.getElementById('card-title-auxiliar').innerHTML = 'Modificar Auxiliar'
      document.getElementById('card-title-auxiliar').style = 'color: red'
    })

    event.preventDefault()
  }

  changeEstado(event, datax) {
    const data = {
      estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
      _id: datax._id
    }
    const response = async () => {
      await axios.put(nodeapi + `auxiliares/${data._id}/estado`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  deleteAuxiliar(event, datax) {
    const data = {
      _id: datax._id
    }
    const response = async () => {
      await axios.delete(nodeapi + `auxiliares/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  registerAuxiliar(event) {
    this.setState({ showRegisterModal: true })
    event.preventDefault()
  }
  getGrupos() {
    const response = async () => {
      await axios.get(nodeapi + 'grupos')
        .then(res => this.setState({ grupos: res.data }))
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
              <h3 className="page-title"> Auxiliares </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Auxiliares</li>
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
                    onChange={(event) => this.setState({ searchAuxiliar: event.target.value })}
                  />
                  <button
                    type="submit"
                    className="col-lg-3 btn btn-primary mr-2"
                  // onClick={onClickSearchButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg> Buscar
                  </button>
                  {
                    this.state.permissions !== undefined &&
                    this.state.permissions.isAddble &&
                    ( 
                      <button
                        className='col-lg-2 btn badge-success mr-2'
                        onClick={evt => this.registerAuxiliar(evt)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-plus" viewBox="0 0 16 16">
  <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"/>
  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
</svg> Registrar Nuevo
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Lista de Auxiliares</h4>
                    {/* <p className="card-description"> Add className <code>.table-hover</code>
                          </p> */}
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Codigo</th>
                            <th>Grupo</th>
                            {/* <th>Descripcion</th> */}
                            {/*<th>Estado</th>*/}
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <ItemPagination
                            url={`auxiliares/all`}
                            ItemComponent={({ item }) => (
                              <tr>
                                <td>{item.nombre}</td>
                                <td>{item.codigo}</td>
                                <td>
                                  {
                                    this.state.grupos !== null && this.state.grupos.find(itemz => itemz._id === item.grupoId) !== undefined ?
                                      this.state.grupos.find(itemz => itemz._id === item.grupoId).nombre :
                                      null
                                  }
                                </td>
                                {/* <td style={{whiteSpace: 'normal',maxWidth: '300px'}}>{index.descripcion}</td> */}
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
                                            onClick={evt => this.modifyAuxiliar(evt, item)}>
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
                                            onClick={evt => this.deleteAuxiliar(evt, item)}
                                          >
                                            <span

                                              style={{
                                                fontSize: '14px',
                                              }}>Eliminar</span>
                                          </Dropdown.Item>
                                        )
                                      }
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </td>
                              </tr>
                            )}
                          />
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
                  <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title" id="card-title-auxiliar">Registrar Auxiliar</h4>
                          <p className="card-description">Todos los campos son requeridos</p>
                          <form className="forms-sample">
                            <Form.Group>
                              <label htmlFor="exampleInputUsername1">Nombre de Auxiliar</label>
                              <Form.Control onChange={this.handleNombre} type="text" id="inputNombre" placeholder="Nombre de Auxiliar" size="lg" required />
                            </Form.Group>
                            {/* <Form.Group>
                              <label htmlFor="exampleInputEmail1">Codigo</label>
                              <Form.Control onChange={this.handleCodigo} type="Codigo" className="form-control" id="inputCodigo" placeholder="Codigo" required/>
                            </Form.Group> */}
                            <Form.Group>
                              <label>Grupo</label>
                              <select className="form-control" required id="inputGrupoId" onChange={this.handleGrupoId}>
                                <option hidden value=''>Escoga una Opcion</option>
                                {
                                  this.state.grupos !== null ?
                                    this.state.grupos.map((index, key) => (
                                      <option value={index._id} key={key}>{index.nombre}</option>
                                    ))
                                    : <option>Cargando...</option>
                                }
                              </select>
                            </Form.Group>
                            {/* <Form.Group>
                              <label htmlFor="exampleTextarea1">Descripcion</label>
                              <textarea className="form-control" id="inputDescripcion" onChange={this.handleDescripcion} rows="4" placeholder="Descripcion Corta del Auxiliar" required></textarea>
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
                  <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title" id="card-title-auxiliar">Registrar Auxiliar</h4>
                          <p className="card-description">Todos los campos son requeridos</p>
                          <form className="forms-sample">
                            <Form.Group>
                              <label htmlFor="exampleInputUsername1">Nombre de Auxiliar</label>
                              <Form.Control onChange={this.handleNombre} type="text" id="inputNombre" placeholder="Nombre de Auxiliar" size="lg" required />
                            </Form.Group>
                            {/* <Form.Group>
                              <label htmlFor="exampleInputEmail1">Codigo</label>
                              <Form.Control onChange={this.handleCodigo} type="Codigo" className="form-control" id="inputCodigo" placeholder="Codigo" required/>
                            </Form.Group> */}
                            <Form.Group>
                              <label>Grupo</label>
                              <select className="form-control" required id="inputGrupoId" onChange={this.handleGrupoId}>
                                <option hidden value=''>Escoga una Opcion</option>
                                {
                                  this.state.grupos !== null ?
                                    this.state.grupos.map((index, key) => (
                                      <option value={index._id} key={key}>{index.nombre}</option>
                                    ))
                                    : <option>Cargando...</option>
                                }
                              </select>
                            </Form.Group>
                            {/* <Form.Group>
                              <label htmlFor="exampleTextarea1">Descripcion</label>
                              <textarea className="form-control" id="inputDescripcion" onChange={this.handleDescripcion} rows="4" placeholder="Descripcion Corta del Auxiliar" required></textarea>
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

export default Auxiliar
