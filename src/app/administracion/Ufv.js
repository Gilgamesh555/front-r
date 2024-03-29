import React, { Component } from 'react';
import { Form, Dropdown, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { Views } from '../../views/Views';

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'
import { ItemPagination } from './ItemPagination';

export class Ufv extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuth: '',
      fecha: '',
      valor: '',
      estado: '',
      error: '',
      id: '',
      data: null,
      searchUfv: '',
      request: 'false',
      viewId: Views.ufv,
      permissions: null,
      changeToEdit: false,
      showRegisterModal: false,
      showModifyModal: false,
      ufvUrl: 'ufv/all'
    }
    // Register User
    this.handleFecha = this.handleFecha.bind(this)
    this.handleValor = this.handleValor.bind(this)

    // Form Handler
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.modifyValor = this.modifyValor.bind(this)

    this.changeEstado = this.changeEstado.bind(this)
    this.deleteUfv = this.deleteUfv.bind(this)
    this.registerUfv = this.registerUfv.bind(this)
  }

  handleFecha(event) {
    this.setState({ fecha: event.target.value })
  }

  handleValor(event) {
    this.setState({ valor: event.target.value })
  }

  handleRegisterSubmit(event) {
    var text = document.getElementById('card-title-ufv').textContent
    if (text === 'Modificar Valor') {
      const data = {
        fecha: this.state.fecha,
        valor: this.state.valor,
        estado: this.state.estado,
        _id: this.state.id
      }
      const response = async () => {
        await axios.put(nodeapi + `ufv/${data._id}`, data)
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
        fecha: this.state.fecha,
        valor: this.state.valor,
        estado: 'activo',
      }
      console.log(data)
      const response = async () => {
        await axios.post(nodeapi + 'ufv', data)
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
    document.getElementById('inputFecha').value = this.state.fecha
    document.getElementById('inputValor').value = ''

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
            window.localStorage.removeItem('token');
            this.setState({ isAuth: 'failed' });
            this.props.history.push('/login');
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
    this.putDate()
  }

  getData() {
    const response = async () => {
      await axios.get(nodeapi + 'ufv')
        .then(res => this.setState({ data: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  //crud
  modifyValor(event, data) {
    this.setState({
      id: data._id,
      estado: data.estado,
      nombre: data.nombre,
      codigo: data.codigo,
      changeToEdit: !this.state.changeToEdit,
      showModifyModal: true,
    }, () => {
      document.getElementById('inputFecha').value = data.fecha
      document.getElementById('inputValor').value = data.valor

      document.getElementById('card-title-ufv').innerHTML = 'Modificar Valor'
      document.getElementById('card-title-ufv').style = 'color: red'

    })
    event.preventDefault()
  }

  changeEstado(event, datax) {
    const data = {
      estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
      _id: datax._id
    }
    const response = async () => {
      await axios.put(nodeapi + `ufv/${data._id}/estado`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  deleteUfv(event, datax) {
    const data = {
      _id: datax._id
    }
    const response = async () => {
      await axios.delete(nodeapi + `ufv/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  registerUfv(event) {
    this.setState({ showRegisterModal: true })
    event.preventDefault()
  }

  onClickSearchButton(event) {
    this.setState({ufvUrl: `ufv/search?searchInput=${this.state.searchUfv}`})
    event.preventDefault();
  }

  putDate() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var date = now.toISOString().slice(0, 10);
    this.setState({ fecha: date })
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
              <h3 className="page-title">UFV</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Ufv</li>
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
                    onChange={(event) => this.setState({ searchUfv: event.target.value })}
                  />
                  <button
                    type="submit"
                    className="col-lg-3 btn btn-primary mr-2"
                    onClick={(event) => this.onClickSearchButton(event)}
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
                        onClick={evt => this.registerUfv(evt)}
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
                    <h4 className="card-title">Lista de UFV's</h4>
                    {/* <p className="card-description"> Add className <code>.table-hover</code>
                          </p> */}
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Valor</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <ItemPagination
                            url={this.state.ufvUrl}
                            ItemComponent={({ item }) => (
                              <tr>
                                <td>{item.fecha}</td>
                                <td>{item.valor}</td>
                                <td>
                                  <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic"></Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {
                                        this.state.permissions !== undefined &&
                                        this.state.permissions.isEditable &&
                                        (
                                          <Dropdown.Item href="#/action-1" onClick={evt => this.modifyValor(evt, item)}>
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
                                          <Dropdown.Item href="#/action-2" onClick={evt => this.deleteUfv(evt, item)}>
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
                          <h4 className="card-title" id="card-title-ufv">Registrar UFV</h4>
                          <p className="card-description">Todos los campos son requeridos</p>
                          <form className="forms-sample">
                            <Form.Group>
                              <label htmlFor="exampleInputUsername1">Fecha</label>
                              <Form.Control onChange={this.handleFecha} type="date" id="inputFecha" defaultValue={this.state.fecha} placeholder="Nombre de Oficina" size="lg" required />
                            </Form.Group>
                            <Form.Group>
                              <label htmlFor="exampleInputEmail1">Valor</label>
                              <Form.Control onChange={this.handleValor} type="number" className="form-control" id="inputValor" placeholder="0.0000" steps="any" required />
                            </Form.Group>
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
                          <h4 className="card-title" id="card-title-ufv">Registrar UFV</h4>
                          <p className="card-description">Todos los campos son requeridos</p>
                          <form className="forms-sample">
                            <Form.Group>
                              <label htmlFor="exampleInputUsername1">Fecha</label>
                              <Form.Control onChange={this.handleFecha} type="date" id="inputFecha" defaultValue={this.state.fecha} placeholder="Nombre de Oficina" size="lg" required />
                            </Form.Group>
                            <Form.Group>
                              <label htmlFor="exampleInputEmail1">Valor</label>
                              <Form.Control onChange={this.handleValor} type="number" className="form-control" id="inputValor" placeholder="0.0000" steps="any" required />
                            </Form.Group>
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

          </div>
        )
      }
    }
  }
}

export default Ufv
