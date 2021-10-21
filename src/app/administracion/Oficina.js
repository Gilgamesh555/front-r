import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

export class Oficina extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isAuth: '',
          isAdmin: '',
          nombre: '',
          codigo: '',
          error: '',
          id: '',
          estado: '',
          data: null,
          searchOficina: '',
        }
        this.handleCodigo = this.handleCodigo.bind(this)
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
      if(token) {
        this.verifytoken()
      }else{
        this.props.history.push('/login')
      }
    }

    handleNombre(event) {
      this.setState({nombre: event.target.value})
    }

    handleCodigo(event) {
      this.setState({codigo: event.target.value})
    }

    handleRegisterSubmit(event) {
      var text =  document.getElementById('card-title-oficina').textContent
      if(text === 'Modificar Oficina') {
        const data = {
          nombre: this.state.nombre,
          codigo: this.state.codigo,
          estado: this.state.estado,
          _id: this.state.id
        }
        const response = async () => {
          await axios.put(nodeapi+`oficinas/${data._id}`, data)
          .then(res => {
            console.log(res.data)
          })
          .catch(err => console.log(err))
        }
        response()
      } else {
        const data = {
          nombre: this.state.nombre,
          codigo: this.state.codigo,
          estado: 'activo',
        }
        const response = async () => {
          await axios.post(nodeapi+'oficinas', data)
          .then(res => {
            if(res.data.error){
              this.setState({error: res.data.error})
            }else{
              console.log(res.data.msg)
            }
          })
          .catch(err => console.log(err))
        }
        response()
      }
      // event.preventDefault()
    }

    handleReset(event) {
      document.getElementById('inputNombre').value = ''
      document.getElementById('inputCodigo').value = ''
      event.preventDefault()
    }
  
    async verifytoken() {
      const data = {
        token: window.localStorage.getItem('token')
      }
      if(data.token){
        await axios.post(nodeapi+'users/verify', data)
        .then(res => {
          if(res.data.status === 'ok'){
            const role = this.decodeToken(data.token).role
            if(role !== undefined && role === 'admin'){
              this.setState({isAuth: 'correct'})
              this.setState({isAdmin: 'correct'})
            }else{
              this.setState({isAdmin: 'failed'})
              this.props.history.push('/login')
            }
          }else{
            window.localStorage.removeItem('token')
            this.setState({isAuth: 'failed'})
          }
        })
        .catch(err => err)
      }
    }

    decodeToken(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    }

    componentDidMount(){
      this.checkToken()
      this.getData()
    }

    getData() {
      const response = async () => {
        await axios.get(nodeapi+'oficinas')
        .then(res => this.setState({data: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

    //crud
    modifyOficina(event, data) {
      document.getElementById('inputNombre').value = data.nombre
      document.getElementById('inputCodigo').value = data.codigo
      document.getElementById('card-title-oficina').innerHTML = 'Modificar Oficina'
      document.getElementById('card-title-oficina').style = 'color: red'
      this.setState({id: data._id, estado: data.estado, nombre: data.nombre, codigo: data.codigo})
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
        await axios.put(nodeapi+`oficinas/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }
      response()
      event.preventDefault()
      window.location.reload()
    }

    deleteOficina(event ,datax) {
      const data = {
        nombre: datax.nombre,
        codigo: datax.codigo,
        estado: datax.estado,
        _id: datax._id,
      }
      const response = async () => {
        await axios.delete(nodeapi+`oficinas/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }
      response()
      event.preventDefault()
      window.location.reload()
    }

    registerOficina(event) {
      document.getElementById('inputNombre').value = ''
      document.getElementById('inputCodigo').value = ''
      document.getElementById('card-title-oficina').innerHTML = 'Registrar Oficina'
      document.getElementById('card-title-oficina').style = 'color: black'
      event.preventDefault()
    }

    render() {
        // const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }

        if(this.state.isAuth === ''){
          return null
        }else{
          if(this.state.isAuth === 'failed'){
            return(
              <Redirect to={{pathname: '/login'}} />
            )
          }
          else{
            if(this.state.isAdmin === ''){
              return null
            }
            return (
              <div>
                  <div className="page-header">
                      <h3 className="page-title"> Oficinas </h3>
                      <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                          <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                          <li className="breadcrumb-item active" aria-current="page">Oficinas</li>
                          </ol>
                      </nav>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 grid-margin stretch-card" style={{marginBottom: '0px'}}>
                      <div className="form-group" style={{width: '100%'}}>
                        <input type="search" className="form-control" placeholder="Buscar" onChange={(event) => this.setState({searchOficina: event.target.value})}/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 grid-margin stretch-card">
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
                                  <th>Estado</th>
                                  <th>Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                  {
                                    this.state.data !== null ? 
                                    this.state.data
                                    .filter((index) => {
                                      if(this.state.searchOficina === ''){
                                        return index
                                      }else{
                                        if(index.nombre.toLowerCase().includes(this.state.searchOficina.toLocaleLowerCase()) || index.codigo.toLowerCase().includes(this.state.searchOficina.toLocaleLowerCase())){
                                          return index
                                        }
                                      }
                                      return null
                                    })
                                    .map((index, key) => (
                                      <tr key={key}>
                                        <td>{index.nombre}</td>
                                        <td>{index.codigo}</td>
                                        <td className={index.estado === 'activo' ? 'text-success' : 'text-danger'}> 
                                          {index.estado} <i className={index.estado === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
                                        </td>
                                        <td>
                                          <a href="!#" onClick={evt => this.modifyOficina(evt, index)} className="badge badge-warning" style={{marginRight: '3px'}} >Modificar</a>
                                          <a href="!#" onClick={evt => this.changeEstado(evt, index)} className="badge badge-info" style={{marginRight: '3px'}} >Mod Estado</a>
                                          <a href="!#" onClick={evt => this.deleteOficina(evt, index)} className="badge badge-danger" style={{marginRight: '3px'}}>Eliminar</a>
                                        </td>
                                      </tr>
                                    ))
                                    : null
                                  }
                                {/* <tr>
                                  <td>Messsy</td>
                                  <td>Flash</td>
                                  <td className="text-danger"> 21.06% <i className="mdi mdi-arrow-down"></i></td>
                                  <td><label className="badge badge-warning">In progress</label></td>
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
                                  <td>
                                  <a href="!#" onClick={evt => this.registerOficina(evt)} className="badge badge-success" style={{marginRight: '3px', color: 'white'}}>Registrar Nuevo</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title" id="card-title-oficina">Registrar Oficina</h4>
                          <p className="card-description">Todos los campos son requeridos</p>
                          <form className="forms-sample">
                            <Form.Group>
                              <label htmlFor="exampleInputUsername1">Nombre de Oficina</label>
                              <Form.Control onChange={this.handleNombre} type="text" id="inputNombre" placeholder="Nombre de Oficina" size="lg" required/>
                            </Form.Group>
                            <Form.Group>
                              <label htmlFor="exampleInputEmail1">Codigo</label>
                              <Form.Control onChange={this.handleCodigo} type="Codigo" className="form-control" id="inputCodigo" placeholder="Codigo" required/>
                            </Form.Group>
                            {/* <div className="form-check">
                              <label className="form-check-label text-muted">
                                <input type="checkbox" className="form-check-input"/>
                                <i className="input-helper"></i>
                                Remember me
                              </label>
                            </div> */}
                            <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                            <button className="btn btn-light" onClick={this.handleReset}>Borrar Datos</button>
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

export default Oficina
