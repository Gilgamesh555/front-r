import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

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
      this.setState({nombre: event.target.value})
    }

    handleCodigo(event) {
      this.setState({codigo: event.target.value})
    }

    handleDescripcion(event) {
      this.setState({descripcion: event.target.value})
    }

    handleGrupoId(event) {
      this.setState({grupoId: event.target.value})
    }

    handleRegisterSubmit(event) {
      var text =  document.getElementById('card-title-auxiliar').textContent
      if(text === 'Modificar Auxiliar') {
        const data = {
          nombre: this.state.nombre,
          codigo: this.state.codigo,
          descripcion: this.state.descripcion,
          grupoId: this.state.grupoId,
          _id: this.state.id,
          estado: this.state.estado,
        }
        console.log(data)
        const response = async () => {
          await axios.put(nodeapi+`auxiliares/${data._id}`, data)
          .then(res => {
            if(res.data.error){
              if(res.data.error === 11000){
                if(res.data.errmsg.includes('codigo')){
                  this.setState({error: 'Codigo Ya en uso'})
                }else{
                  this.setState({error: 'Nombre de Usuario Ya en uso'})
                }
              }else{
                this.setState({error: res.data.error})
              }
            }else{
              console.log(res.data.msg)
              this.setState({request: 'true'})
            }
          })
          .catch(err => console.log(err))
        }
        response()
      } else {
        const data = {
          nombre: this.state.nombre,
          codigo: this.state.codigo,
          descripcion: this.state.descripcion,
          grupoId: this.state.grupoId,
          estado: 'activo',
        }
        const response = async () => {
          await axios.post(nodeapi+'auxiliares', data)
          .then(res => {
            if(res.data.error){
              if(res.data.error === 11000){
                if(res.data.errmsg.includes('codigo')){
                  this.setState({error: 'Codigo Ya en uso'})
                }else{
                  this.setState({error: 'Nombre de Grupo Ya en uso'})
                }
              }else{
                this.setState({error: res.data.error})
              }
            }else{
              console.log(res.data.msg)
              this.setState({request: 'true'})
            }
          })
          .catch(err => console.log(err))
        }
        if(this.state.confirmPassword === this.state.password){
          response()
        } else {
          this.setState({error: 'Las contraseñas no coinciden'})
        }
      }
      event.preventDefault()
    }

    handleReset(event) {
      document.getElementById('inputCodigo').value = ''
      document.getElementById('inputNombre').value = ''
      document.getElementById('inputDescripcion').value = ''
      document.getElementById('inputGrupoId').value = ''

      event.preventDefault()
    }

    checkToken() {
      const token = window.localStorage.getItem('token')
      if(token) {
        this.verifytoken()
      }else{
        this.props.history.push('/login')
      }
    }
  
    async verifytoken() {
      const data = {
        token: window.localStorage.getItem('token')
      }
      if(data.token){
        await axios.post(nodeapi+'users/verify', data)
        .then(res => {
          if(res.data.status === 'ok'){
            this.setState({isAuth: 'correct'})
          }else{
            window.localStorage.removeItem('token')
            this.setState({isAuth: 'failed'})
          }
        })
        .catch(err => err)
      }
    }

    componentDidMount(){
      this.checkToken()
      this.getData()
      this.getGrupos()
    }

    getData() {
      const response = async () => {
        await axios.get(nodeapi+'auxiliares')
        .then(res => this.setState({data: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

    //crud
    modifyAuxiliar(event, data) {
      document.getElementById('inputCodigo').value = data.codigo
      document.getElementById('inputNombre').value = data.nombre
      document.getElementById('inputDescripcion').value = data.nombre
      document.getElementById('inputGrupoId').value = data.grupoId

      document.getElementById('card-title-auxiliar').innerHTML = 'Modificar Auxiliar'
      document.getElementById('card-title-auxiliar').style = 'color: red'

      this.setState({id: data._id, estado: data.estado, nombre: data.nombre, codigo: data.codigo, descripcion: data.descripcion, grupoId: data.grupoId})
      event.preventDefault()
    }

    changeEstado(event, datax) {
      const data = {
        estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
        _id: datax._id
      }
      const response = async () => {
        await axios.put(nodeapi+`auxiliares/${data._id}/estado`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }
      response()
      event.preventDefault()
      window.location.reload()
    }

    deleteAuxiliar(event ,datax) {
      const data = {
        _id: datax._id
      }
      const response = async () => {
        await axios.delete(nodeapi+`auxiliares/${data._id}`, data)
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
      document.getElementById('inputNombre').value = ''
      document.getElementById('inputCodigo').value = ''
      document.getElementById('inputDescripcion').value = ''
      document.getElementById('inputGrupoId').value = ''

      document.getElementById('card-title-auxiliar').innerHTML = 'Registrar Auxiliar'
      document.getElementById('card-title-auxiliar').style = 'color: black'
      event.preventDefault()
    }
    getGrupos() {
        const response = async () => {
        await axios.get(nodeapi+'grupos')
        .then(res => this.setState({grupos: res.data}))
        .catch(err => console.log(err))
        }
        response()
    }

    render() {
        // const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }

        if(this.state.request === 'true') {
          window.location.reload()
        }

        if(this.state.isAuth === ''){
          return null
        }else{
          if(this.state.isAuth === 'failed'){
            return(
              <Redirect to={{pathname: '/login'}} />
            )
          }
          else{
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
                    <div className="col-lg-6 grid-margin stretch-card" style={{marginBottom: '0px'}}>
                      <div className="form-group" style={{width: '100%'}}>
                        <input type="search" className="form-control" placeholder="Buscar" onChange={(event) => this.setState({searchAuxiliar: event.target.value})}/>
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
                                  <th>Grupo</th>
                                  <th>Descripcion</th>
                                  <th>Estado</th>
                                  <th>Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                  {
                                    this.state.data !== null ? 
                                    this.state.data
                                    .filter((index) => {
                                      if(this.state.searchAuxiliar === ''){
                                        return index
                                      }else{
                                        if(index.nombre.toLowerCase().includes(this.state.searchAuxiliar.toLocaleLowerCase()) || index.codigo.toLowerCase().includes(this.state.searchAuxiliar.toLocaleLowerCase())){
                                          return index
                                        }
                                      }
                                      return null
                                    })
                                    .map((index, key) => (
                                      <tr key={key}>
                                        <td>{index.nombre}</td>
                                        <td>{index.codigo}</td>
                                        <td>
                                        {
                                          this.state.grupos !== null && this.state.grupos.find(item => item._id === index.grupoId) !== undefined ? 
                                          this.state.grupos.find(item => item._id === index.grupoId).nombre :
                                          null
                                        }
                                        </td>
                                        <td style={{whiteSpace: 'normal',maxWidth: '300px'}}>{index.descripcion}</td>
                                        <td className={index.estado === 'activo' ? 'text-success' : 'text-danger'}> 
                                          {index.estado} <i className={index.estado === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
                                        </td>
                                        <td>
                                          <a href="!#" onClick={evt => this.modifyAuxiliar(evt, index)} className="badge badge-warning" style={{marginRight: '3px'}} >Modificar</a>
                                          <a href="!#" onClick={evt => this.changeEstado(evt, index)} className="badge badge-info" style={{marginRight: '3px'}} >Mod Estado</a>
                                          <a href="!#" onClick={evt => this.deleteAuxiliar(evt, index)} className="badge badge-danger" style={{marginRight: '3px'}}>Eliminar</a>
                                        </td>
                                      </tr>
                                    ))
                                    : null
                                  }
                                <tr>
                                  <td>
                                  <a href="!#" onClick={evt => this.registerAuxiliar(evt)} className="badge badge-success" style={{marginRight: '3px', color: 'whitesmoke'}}>Registrar Nuevo</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-md-6 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title" id="card-title-auxiliar">Registrar Auxiliar</h4>
                          <p className="card-description">Todos los campos son requeridos</p>
                          <form className="forms-sample">
                            <Form.Group>
                              <label htmlFor="exampleInputUsername1">Nombre de Auxiliar</label>
                              <Form.Control onChange={this.handleNombre} type="text" id="inputNombre" placeholder="Nombre de Auxiliar" size="lg" required/>
                            </Form.Group>
                            <Form.Group>
                              <label htmlFor="exampleInputEmail1">Codigo</label>
                              <Form.Control onChange={this.handleCodigo} type="Codigo" className="form-control" id="inputCodigo" placeholder="Codigo" required/>
                            </Form.Group>
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
                            <Form.Group>
                              <label htmlFor="exampleTextarea1">Descripcion</label>
                              <textarea className="form-control" id="inputDescripcion" onChange={this.handleDescripcion} rows="4" placeholder="Descripcion Corta del Auxiliar" required></textarea>
                            </Form.Group>
                            <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                            <button className="btn btn-light" onClick={evt => this.handleReset(evt)}>Borrar Datos</button>
                            {
                              this.state.error !== '' ? <label style={{color: 'red', fontSize: '0.875rem'}}>{this.state.error}</label> : null
                            }
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

              </div>
            )
          }
        }
    }
}

export default Auxiliar
