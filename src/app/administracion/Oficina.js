import React, { Component } from 'react';
import { Form, Dropdown, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'
import { Views } from '../../views/Views';
import { ItemPagination } from './ItemPagination';
import ActivesByDepartmentReport from './oficina/ActivesByDepartmentReport';
import { PDFDownloadLink } from '@react-pdf/renderer';

export class Oficina extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuth: '',
      nombre: '',
      codigo: '',
      error: '',
      id: '',
      estado: '',
      data: null,
      searchOficina: '',
      viewId: Views.departamentos,
      permissions: null,
      changeToEdit: false,
      showRegisterModal: false,
      showModifyModal: false,
      oficinaUrl: 'oficinas/all'
    }
    this.handleNombre = this.handleNombre.bind(this)
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.modifyOficina = this.modifyOficina.bind(this)
    this.changeEstado = this.changeEstado.bind(this)
    this.deleteOficina = this.deleteOficina.bind(this)
    this.registerOficina = this.registerOficina.bind(this)
  }

  checkToken() {
    const token = window.localStorage.getItem('token')
    if (token) {
      this.verifytoken()
    } else {
      this.props.history.push('/login')
    }
  }

  handleNombre(event) {
    this.setState({ nombre: event.target.value })
  }

  handleRegisterSubmit(event) {
    var text = document.getElementById('card-title-oficina').textContent
    if (text === 'Modificar Oficina') {
      const data = {
        nombre: this.state.nombre,
        estado: this.state.estado,
        _id: this.state.id
      }
      const response = async () => {
        await axios.put(nodeapi + `oficinas/${data._id}`, data)
          .then(res => {
            console.log(res.data)
            this.getData()
          })
          .catch(err => console.log(err))
      }
      response()
    } else {
      const data = {
        nombre: this.state.nombre,
        estado: 'activo',
      }
      const response = async () => {
        await axios.post(nodeapi + 'oficinas', data)
          .then(res => {
            if (res.data.error) {
              this.setState({ error: res.data.error })
            } else {
              console.log(res.data.msg)
              this.getData()
            }
          })
          .catch(err => console.log(err))
      }
      response()
    }

    event.preventDefault()
  }

  handleReset(event) {
    document.getElementById('inputNombre').value = ''
    event.preventDefault()
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
            const permissions = await this.getPermissions(roleId, this.state.viewId);
            if (!permissions.isVisible) {
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

          return res.data;
        }
      })

    return permission;
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
  }

  getData() {
    const response = async () => {
      await axios.get(nodeapi + 'oficinas')
        .then(res => this.setState({ data: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  //crud
  modifyOficina(event, data) {
    this.setState({
      id: data._id,
      estado: data.estado,
      nombre: data.nombre,
      codigo: data.codigo,
      changeToEdit: !this.state.changeToEdit,
      showModifyModal: true,
    }, () => {
      document.getElementById('inputNombre').value = data.nombre
      document.getElementById('card-title-oficina').innerHTML = 'Modificar Oficina'
      document.getElementById('card-title-oficina').style = 'color: red'
    })
    event.preventDefault()
  }

  changeEstado(event, datax) {
    const data = {
      nombre: datax.nombre,
      codigo: datax.codigo,
      estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
      _id: datax._id
    }
    const response = async () => {
      await axios.put(nodeapi + `oficinas/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  deleteOficina(event, datax) {
    const data = {
      nombre: datax.nombre,
      codigo: datax.codigo,
      estado: datax.estado,
      _id: datax._id,
    }
    const response = async () => {
      await axios.delete(nodeapi + `oficinas/${data._id}`, data)
        .then(res => {
          console.log(res.data)
          this.getData()
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    // window.location.reload()
  }

  registerOficina(event) {
    this.setState({ showRegisterModal: true })
    event.preventDefault()
  }

  onClickSearchButton(event) {
    this.setState({oficinaUrl: `oficinas/search?searchInput=${this.state.searchOficina}`})
    event.preventDefault();
  }

  render() {
    // const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }

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
              <h3 className="page-title"> Departamentos </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Departamentos</li>
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
                    onChange={(event) => this.setState({ searchOficina: event.target.value })}
                  />
                  <button
                    type="submit"
                    className="col-lg-3 btn btn-primary mr-2"
                    onClick={event => this.onClickSearchButton(event)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>  Buscar
                  </button>
                  {
                    this.state.permissions !== undefined &&
                    this.state.permissions.isAddble &&
                    (
                      <button
                        className='col-lg-3 btn badge-success mr-2'
                        onClick={evt => this.registerOficina(evt)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>  Registrar Nuevo
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
                    <h4 className="card-title">INFORMACION</h4>
                    {/* <p className="card-description"> Add className <code>.table-hover</code>
                          </p> */}
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Codigo</th>
                            {/*<th>Estado</th>*/}
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <ItemPagination
                            url={this.state.oficinaUrl}
                            ItemComponent={({ item }) => (
                              <tr>
                                <td>{item.nombre}</td>
                                <td>{item.codigo}</td>
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
                                          <>
                                            <Dropdown.Item
                                              href="#/action-1"
                                              onClick={evt => this.modifyOficina(evt, item)}>
                                              <span

                                                style={{
                                                  color: '#000',
                                                  backgroundColor: 'transparent',
                                                  fontSize: '14px'
                                                }}>
                                                Modificar
                                              </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">
                                              <a>
                                                <PDFDownloadLink
                                                  document={<ActivesByDepartmentReport data={item} />}
                                                  fileName={`reporte-departamento-${item.nombre}`}
                                                  style={{
                                                    color: '#000',
                                                    backgroundColor: 'transparent'
                                                  }}>
                                                  Rept. Activos
                                                </PDFDownloadLink>
                                              </a>
                                            </Dropdown.Item>
                                          </>
                                        )
                                      }
                                      {
                                        this.state.permissions !== undefined &&
                                        this.state.permissions.isDeletable &&
                                        (
                                          <Dropdown.Item
                                            href="#/action-2"
                                            onClick={evt => this.deleteOficina(evt, item)}
                                          >
                                            <span

                                              style={{
                                                color: '#000',
                                                backgroundColor: 'transparent',
                                                fontSize: '14px'
                                              }}>
                                              Eliminar
                                            </span>
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
              <Modal
                show={this.state.showRegisterModal}
                onHide={() => this.setState({ showRegisterModal: false })}
                centered
              >
                {
                  (this.state.changeToEdit || this.state.permissions.isAddble) &&
                  (
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title" id="card-title-oficina">Registrar Departamentos</h4>
                        <p className="card-description">Todos los campos son requeridos</p>
                        <form className="forms-sample">
                          <Form.Group>
                            <label htmlFor="exampleInputUsername1">Nombre de Departamento</label>
                            <Form.Control onChange={this.handleNombre} type="text" id="inputNombre" placeholder="Nombre de Departamento" size="lg" required />
                          </Form.Group>
                          <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                          <button className="btn btn-light" onClick={this.handleReset}>Borrar Datos</button>
                          {
                            this.state.error !== '' ? <label style={{ color: 'red', fontSize: '0.875rem' }}>{this.state.error}</label> : null
                          }
                        </form>
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
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title" id="card-title-oficina">Registrar Departamentos</h4>
                        <p className="card-description">Todos los campos son requeridos</p>
                        <form className="forms-sample">
                          <Form.Group>
                            <label htmlFor="exampleInputUsername1">Nombre de Departamento</label>
                            <Form.Control onChange={this.handleNombre} type="text" id="inputNombre" placeholder="Nombre de Departamento" size="lg" required />
                          </Form.Group>
                          <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                          <button className="btn btn-light" onClick={this.handleReset}>Borrar Datos</button>
                          {
                            this.state.error !== '' ? <label style={{ color: 'red', fontSize: '0.875rem' }}>{this.state.error}</label> : null
                          }
                        </form>
                      </div>
                    </div>
                  )
                }
              </Modal>
            </div>
          </div>
        )
      }
    }
  }
}

export default Oficina
