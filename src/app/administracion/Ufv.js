import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

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
          searchGrupo: '',
          request: 'false',
        }
        // Register User
        this.handleFecha = this.handleFecha.bind(this)
        this.handleValor = this.handleValor.bind(this)

        // Form Handler
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.modifyValor = this.modifyValor.bind(this)
        
        this.changeEstado = this.changeEstado.bind(this)
        this.deleteGrupo = this.deleteGrupo.bind(this)
        this.registerGrupo = this.registerGrupo.bind(this)
    }

    handleFecha(event) {
      this.setState({fecha: event.target.value})
    }

    handleValor(event) {
      this.setState({valor: event.target.value})
    }

    handleRegisterSubmit(event) {
      var text =  document.getElementById('card-title-grupo').textContent
      if(text === 'Modificar Valor') {
        const data = {
          fecha: this.state.fecha,
          valor: this.state.valor,
          estado: this.state.estado,
          _id: this.state.id
        }
        const response = async () => {
          await axios.put(nodeapi+`ufv/${data._id}`, data)
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
          fecha: this.state.fecha,
          valor: this.state.valor,
          estado: 'activo',
        }
        console.log(data)
        const response = async () => {
          await axios.post(nodeapi+'ufv', data)
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
      // document.getElementById('inputFecha').value = ''
      document.getElementById('inputValor').value = ''

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
      this.putDate()
    }

    getData() {
      const response = async () => {
        await axios.get(nodeapi+'ufv')
        .then(res => this.setState({data: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

    //crud
    modifyValor(event, data) {
      document.getElementById('inputFecha').value = data.fecha
      document.getElementById('inputValor').value = data.valor

      document.getElementById('card-title-grupo').innerHTML = 'Modificar Valor'
      document.getElementById('card-title-grupo').style = 'color: red'

      this.setState({id: data._id, estado: data.estado, nombre: data.nombre, codigo: data.codigo})
      event.preventDefault()
    }

    changeEstado(event, datax) {
      const data = {
        estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
        _id: datax._id
      }
      const response = async () => {
        await axios.put(nodeapi+`grupos/${data._id}/estado`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }
      response()
      event.preventDefault()
      window.location.reload()
    }

    deleteGrupo(event ,datax) {
      const data = {
        _id: datax._id
      }
      const response = async () => {
        await axios.delete(nodeapi+`grupos/${data._id}`, data)
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
      document.getElementById('inputNombre').value = ''
      document.getElementById('inputCodigo').value = ''

      document.getElementById('card-title-grupo').innerHTML = 'Registrar Usuario'
      document.getElementById('card-title-grupo').style = 'color: black'
      event.preventDefault()
    }

    putDate() {
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        var date = now.toISOString().slice(0,10);
        this.setState({fecha: date})
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
                      <h3 className="page-title"> UFV </h3>
                      <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                          <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                          <li className="breadcrumb-item active" aria-current="page">Ufv</li>
                          </ol>
                      </nav>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 grid-margin stretch-card" style={{marginBottom: '0px'}}>
                      <div className="form-group" style={{width: '100%'}}>
                        <input type="search" className="form-control" placeholder="Buscar" onChange={(event) => this.setState({searchGrupo: event.target.value})}/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 grid-margin stretch-card">
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
                                  {
                                    this.state.data !== null ? 
                                    this.state.data
                                    .filter((index) => {
                                      if(this.state.searchGrupo === ''){
                                        return index
                                      }else{
                                        if(index.nombre.toLowerCase().includes(this.state.searchGrupo.toLocaleLowerCase()) || index.codigo.toLowerCase().includes(this.state.searchGrupo.toLocaleLowerCase())){
                                          return index
                                        }
                                      }
                                      return null
                                    })
                                    .map((index, key) => (
                                      <tr key={key}>
                                        <td>{index.fecha}</td>
                                        <td>{index.valor}</td>
                                        <td>
                                          <a href="!#" onClick={evt => this.modifyValor(evt, index)} className="badge badge-warning" style={{marginRight: '3px'}} >Modificar</a>
                                          {/* <a href="!#" onClick={evt => this.changeEstado(evt, index)} className="badge badge-info" style={{marginRight: '3px'}} >Mod Estado</a> */}
                                          <a href="!#" onClick={evt => this.deleteGrupo(evt, index)} className="badge badge-danger" style={{marginRight: '3px'}}>Eliminar</a>
                                        </td>
                                      </tr>
                                    ))
                                    : null
                                  }
                                <tr>
                                  <td>
                                  <a href="!#" onClick={evt => this.registerGrupo(evt)} className="badge badge-success" style={{marginRight: '3px', color: 'whitesmoke'}}>Registrar Nuevo</a>
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
                          <h4 className="card-title" id="card-title-grupo">Registrar UFV</h4>
                          <p className="card-description">Todos los campos son requeridos</p>
                          <form className="forms-sample">
                            <Form.Group>
                              <label htmlFor="exampleInputUsername1">Fecha</label>
                              <Form.Control onChange={this.handleFecha} type="date" id="inputFecha" defaultValue={this.state.fecha} placeholder="Nombre de Oficina" size="lg" required disabled/>
                            </Form.Group>
                            <Form.Group>
                              <label htmlFor="exampleInputEmail1">Valor</label>
                              <Form.Control onChange={this.handleValor} type="number" className="form-control" id="inputValor" placeholder="0.0000" steps="any" required/>
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

export default Ufv
