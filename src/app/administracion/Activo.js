import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'
import QRCode from "react-qr-code";

export class Personal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isAuth: '',
          codigo: '',
          fechaIncorporacion: '',
          fechaRegistro: '',
          ufvId: '',
          grupoId: '',
          auxiliarId: '',
          oficinaId: '',
          usuarioId: '',
          estadoActivo: '',
          costoInicial: '',
          observaciones: '',
          descripcion: '',
          coe: '',
          vida: '',
          estado: '',
          error: '',
          id: '',
          data: null,
          searchUser: '',
          oficinas: null,
					grupos: null,
					auxiliares: null,
					responsables: null,
          ufvs: null,
					qrCode: '',
					request: 'false',
          auxiliarQr: '',
          responsableQr: '',
        }
        // Register User
        this.handleCodigo = this.handleCodigo.bind(this)
        this.handleFechaIncorporacion = this.handleFechaIncorporacion.bind(this)
        this.handleFechaRegistro = this.handleFechaRegistro.bind(this)
        this.handleUfvId = this.handleUfvId.bind(this)
        this.handleGrupoId = this.handleGrupoId.bind(this)
        this.handleAuxiliarId = this.handleAuxiliarId.bind(this)
        this.handleOficinaId = this.handleOficinaId.bind(this)
        this.handleUsuarioId = this.handleUsuarioId.bind(this)
        this.handleEstadoActivo = this.handleEstadoActivo.bind(this)
        this.handleCostoInicial = this.handleCostoInicial.bind(this)
        this.handleObservaciones = this.handleObservaciones.bind(this)
        this.handleDescripcion = this.handleDescripcion.bind(this)
        this.handleVida = this.handleVida.bind(this)
        this.handleCoe = this.handleCoe.bind(this)

        // Form Handler
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.modifyActivo = this.modifyActivo.bind(this)
        
        this.changeEstado = this.changeEstado.bind(this)
        this.deleteActivo = this.deleteActivo.bind(this)
        this.registerActivo = this.registerActivo.bind(this)
        this.getOficinas = this.getOficinas.bind(this)  
				this.generateQR = this.generateQR.bind(this)
    }

    handleCodigo(event) {
      this.setState({codigo: event.target.value})
    }

    handleFechaIncorporacion(event) {
      this.setState({fechaIncorporacion: event.target.value})
    }
    
    handleFechaRegistro(event) { 
      this.setState({fechaRegistro: event.target.value})
    }

    handleUfvId(event) {
      this.setState({ufvId: event.target.value})
    }

    handleGrupoId(event) {
      this.setState({grupoId: event.target.value})
			document.getElementById('inputAuxiliarId').value = ''
    }

    handleAuxiliarId(event) {
      this.setState({auxiliarId: event.target.value})
    }

    handleOficinaId(event) {
      this.setState({oficinaId: event.target.value})
			document.getElementById('inputUsuarioId').value = ''
    }

    handleUsuarioId(event) {
      this.setState({usuarioId: event.target.value})
			const response = async () => {
				await axios.get(nodeapi+`users/${event.target.value}`)
				.then(res => {
					document.getElementById('inputCargo').value = res.data.cargo
				})
				.catch(err => console.log(err))
			}
			response()
    }

    handleEstadoActivo(event) {
      this.setState({estadoActivo: event.target.value})
    }

    handleCostoInicial(event) {
      this.setState({costoInicial: event.target.value})
    }

    handleObservaciones(event) {
      this.setState({observaciones: event.target.value})
    }
    
    handleDescripcion(event) {
      this.setState({descripcion: event.target.value})
    }

    handleCoe(event) {
      this.setState({coe: event.target.value})
    }

    handleVida(event) {
      this.setState({vida: event.target.value})
    }

    handleRegisterSubmit(event) {
      var text =  document.getElementById('card-title-activo').textContent
      if(text === 'Modificar Activo') {
				const data = {
          codigo: this.state.codigo,
          fechaIncorporacion: this.state.fechaIncorporacion,
          fechaRegistro: this.state.fechaRegistro,
          ufvId: this.state.ufvId,
          grupoId: this.state.grupoId,
          auxiliarId: this.state.auxiliarId,
          oficinaId: this.state.oficinaId,
          usuarioId: this.state.usuarioId,
          estadoActivo: this.state.estadoActivo,
          costoInicial: this.state.costoInicial,
          observaciones: this.state.observaciones,
          descripcion: this.state.descripcion,
          vida: this.state.vida,
          coe: this.state.coe,
          estado: this.state.estado,
					_id: this.state.id
        }
				console.log(data)
        const response = async () => {
          await axios.put(nodeapi+`activos/${data._id}`, data)
          .then(res => {
            if(res.data.error){
              if(res.data.error === 11000){
                if(res.data.errmsg.includes('email')){
                  this.setState({error: 'Email Ya en uso'})
                }else{
                  this.setState({error: 'Codigo Ya en uso'})
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
          codigo: this.state.codigo,
          fechaIncorporacion: this.state.fechaIncorporacion,
          fechaRegistro: this.state.fechaRegistro,
          ufvId: this.state.ufvId,
          grupoId: this.state.grupoId,
          auxiliarId: this.state.auxiliarId,
          oficinaId: this.state.oficinaId,
          usuarioId: this.state.usuarioId,
          estadoActivo: this.state.estadoActivo,
          costoInicial: this.state.costoInicial,
          observaciones: this.state.observaciones,
          vida: this.state.vida,
          coe: this.state.coe,
          descripcion: this.state.descripcion,
          estado: 'activo',
        }
        const response = async () => {
          await axios.post(nodeapi+'activos', data)
          .then(res => {
            if(res.data.error){
              if(res.data.error === 11000){
                if(res.data.errmsg.includes('email')){
                  this.setState({error: 'Email Ya en uso'})
                }else{
                  this.setState({error: 'Codigo Ya en uso'})
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
      document.getElementById('inputCargo').value = ''
			document.getElementById('inputUfvId').value = ''
			document.getElementById('inputGrupoId').value = ''
			document.getElementById('inputAuxiliarId').value = ''
			document.getElementById('inputOficinaId').value = ''
			document.getElementById('inputUsuarioId').value = ''
			document.getElementById('inputEstadoActivo').value = ''
			document.getElementById('inputCostoInicial').value = ''
			document.getElementById('inputObservaciones').value = ''
			document.getElementById('inputDescripcion').value = ''
      document.getElementById('inputVida').value = ''
      document.getElementById('inputCoe').value = ''

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
      this.getOficinas()
			this.getGrupos()
			this.getAuxiliares()
			this.getResponsables()
      this.getUfv()
      this.putDate()
    }

    getData() {
      const response = async () => {
        await axios.get(nodeapi+'activos')
        .then(res => this.setState({data: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

    //crud
    modifyActivo(event, data) {
      document.getElementById('inputCodigo').value = data.codigo
      document.getElementById('inputCargo').value = ''
			// document.getElementById('inputUfvId').value = data.ufvId
			document.getElementById('inputGrupoId').value = data.grupoId
			document.getElementById('inputOficinaId').value = data.oficinaId
			document.getElementById('inputEstadoActivo').value = data.estadoActivo
			document.getElementById('inputCostoInicial').value = data.costoInicial
			document.getElementById('inputObservaciones').value = data.observaciones
			document.getElementById('inputDescripcion').value = data.descripcion
      document.getElementById('inputVida').value = data.vida
      document.getElementById('inputCoe').value = data.coe

			var now = new Date(data.fechaRegistro);
			now.setMinutes(now.getDate());
			var date = now.toISOString().slice(0,10);
			document.getElementById('inputFechaRegistro').value = date

			now = new Date(data.fechaIncorporacion);
			now.setMinutes(now.getDate());
			date = now.toISOString().slice(0,10);
			document.getElementById('inputFechaIncorporacion').value = date

      document.getElementById('card-title-activo').innerHTML = 'Modificar Activo'
      document.getElementById('card-title-activo').style = 'color: red'

      this.setState({id: data._id, estado: data.estado, codigo: data.codigo, cargo: data.cargo, ufvId: data.ufvId, grupoId: data.grupoId, auxiliarId: data.auxiliarId, oficinaId: data.oficinaId, usuarioId: data.usuarioId, estadoActivo: data.estadoActivo, costoInicial: data.costoInicial, observaciones: data.observaciones, descripcion: data.descripcion, vida: data.vida, coe: data.coe}, function() {
				document.getElementById('inputUsuarioId').value = data.usuarioId
				document.getElementById('inputAuxiliarId').value = data.auxiliarId
			})
      event.preventDefault()
    }

    changeEstado(event, datax) {
      const data = {
        estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
        _id: datax._id
      }
      const response = async () => {
        await axios.put(nodeapi+`activos/${data._id}/estado`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }
      response()
      event.preventDefault()
      window.location.reload()
    }

    deleteActivo(event ,datax) {
      const data = {
        _id: datax._id
      }
      const response = async () => {
        await axios.delete(nodeapi+`activos/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }
      response()
      event.preventDefault()
      window.location.reload()
    }

		generateQR(event, data) {
      // Auxiliar - Responsable Descripcion

      const response = async () => {
        await axios.get(nodeapi+'auxiliares/'+data.auxiliarId)
        .then(res => this.setState({auxiliarQr: res.data}, function() {
          const responseR = async () => {
            await axios.get(nodeapi+'users/'+data.usuarioId)
            .then(res => this.setState({responsableQr: res.data},  function() {
              this.setState({qrCode: `Codigo: ${data.codigo}. Estado: ${data.estadoActivo}. Descripcion: ${data.descripcion}. Auxiliar: ${this.state.auxiliarQr.nombre}. Responsable: ${this.state.responsableQr.nombre}.`})
            }))
            .catch(err => console.log(err))
          }
          responseR()
        }))
        .catch(err => console.log(err))
      }
      response()
			event.preventDefault()
		}

    registerActivo(event) {
      document.getElementById('inputCodigo').value = ''
      document.getElementById('inputCargo').value = ''
			// document.getElementById('inputUfvId').value = ''
			document.getElementById('inputGrupoId').value = ''
			document.getElementById('inputAuxiliarId').value = ''
			document.getElementById('inputOficinaId').value = ''
			document.getElementById('inputUsuarioId').value = ''
			document.getElementById('inputEstadoActivo').value = ''
			document.getElementById('inputCostoInicial').value = ''
			document.getElementById('inputObservaciones').value = ''
			document.getElementById('inputDescripcion').value = ''
      document.getElementById('inputVida').value = ''
      document.getElementById('inputCoe').value = ''

      document.getElementById('card-title-activo').innerHTML = 'Registrar Usuario'
      document.getElementById('card-title-activo').style = 'color: black'
      event.preventDefault()
    }

    getOficinas() {
      const response = async () => {
        await axios.get(nodeapi+'oficinas')
        .then(res => this.setState({oficinas: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }
    
		getGrupos() {
      const response = async () => {
        await axios.get(nodeapi+'grupos')
        .then(res => this.setState({grupos: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

		getAuxiliares(){
			const response = async () => {
        await axios.get(nodeapi+'auxiliares')
        .then(res => this.setState({auxiliares: res.data}))
        .catch(err => console.log(err))
      }
      response()
		}
		
		getResponsables(){
			const response = async () => {
        await axios.get(nodeapi+'users')
        .then(res => this.setState({responsables: res.data}))
        .catch(err => console.log(err))
      }
      response()
		}

    getUfv(){
      const response = async () => {
        await axios.get(nodeapi+'ufv')
        .then(res => this.setState({ufvs: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

    putDate() {
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        var date = now.toISOString().slice(0,10);
        this.setState({fechaIncorporacion: date, fechaRegistro: date})
    }

    render() {
        // const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }

        // Default Date
        // var now = new Date();
        // now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        // var date = now.toISOString().slice(0,10);

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
                      <h3 className="page-title"> Activos </h3>
                      <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                          <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                          <li className="breadcrumb-item active" aria-current="page">Activos</li>
                          </ol>
                      </nav>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 grid-margin stretch-card" style={{marginBottom: '0px'}}>
                      <div className="form-group" style={{width: '100%'}}>
                        <input type="search" className="form-control" placeholder="Buscar" onChange={(event) => this.setState({searchUser: event.target.value})}/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title">Lista de Activos</h4>
                          {/* <p className="card-description"> Add className <code>.table-hover</code>
                          </p> */}
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Codigo</th>
                                  <th>Fecha Incorporacion</th>
                                  <th>Fecha Registro</th>
                                  <th>UFV</th>
                                  <th>Grupo</th>
                                  <th>Auxiliar</th>
                                  <th>Oficina</th>
                                  <th>Responsable</th>
                                  <th>Estado Activo</th>
                                  <th>Costo Inicial</th>
																	<th>Estado</th>
																	<th>Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                  {
                                    this.state.data !== null ? 
                                    this.state.data
                                    .filter((index) => {
                                      if(this.state.searchUser === ''){
                                        return index
                                      }else{
                                        if(index.nombre.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.apPaterno.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.apMaterno.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.username.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.cargo.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase())){
                                          return index
                                        }
                                      }
                                      return null
                                    })
                                    .map((index, key) => (
                                      <tr key={key}>
                                        <td>{index.codigo}</td>
                                        <td>{index.fechaIncorporacion}</td>
                                        <td>{index.fechaRegistro}</td>
                                        <td>{
                                          this.state.ufvs !== null && this.state.ufvs.find(item => item._id === index.ufvId) !== undefined ? 
                                          this.state.ufvs.find(item => item._id === index.ufvId).valor :
                                          null
                                        }</td>
																				<td>{
                                          this.state.grupos !== null && this.state.grupos.find(item => item._id === index.grupoId) !== undefined ? 
                                          this.state.grupos.find(item => item._id === index.grupoId).nombre :
                                          null
                                        }</td>
																				<td>{
                                          this.state.auxiliares !== null && this.state.auxiliares.find(item => item._id === index.auxiliarId) !== undefined ? 
                                          this.state.auxiliares.find(item => item._id === index.auxiliarId).nombre :
                                          null
                                        }</td>
																				<td>{
                                          this.state.oficinas !== null && this.state.oficinas.find(item => item._id === index.oficinaId) !== undefined ? 
                                          this.state.oficinas.find(item => item._id === index.oficinaId).nombre :
                                          null
                                        }</td>
																				<td>{
                                          this.state.responsables !== null && this.state.responsables.find(item => item._id === index.usuarioId) !== undefined ? 
                                          this.state.responsables.find(item => item._id === index.usuarioId).nombre :
                                          null
                                        }</td>
																				<td>{index.estadoActivo}</td>
																				<td>{index.costoInicial}</td>
                                        <td className={index.estado === 'activo' ? 'text-success' : 'text-danger'}> 
                                          {index.estado} <i className={index.estado === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
                                        </td>
                                        <td>
																					<a href="!#" onClick={evt => this.generateQR(evt, index)} className="badge badge-dark" style={{marginRight: '3px'}}>QR</a>
                                          <a href="!#" onClick={evt => this.modifyActivo(evt, index)} className="badge badge-warning" style={{marginRight: '3px'}} >Modificar</a>
                                          <a href="!#" onClick={evt => this.changeEstado(evt, index)} className="badge badge-info" style={{marginRight: '3px'}} >Mod Estado</a>
                                          <a href="!#" onClick={evt => this.deleteActivo(evt, index)} className="badge badge-danger" style={{marginRight: '3px'}}>Eliminar</a>
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
                                  <a href="!#" onClick={evt => this.registerActivo(evt)} className="badge badge-success" style={{marginRight: '3px', color: 'whitesmoke'}}>Registrar Nuevo</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
									{
										this.state.qrCode !== '' ?
										<div className="col-lg-4 grid-margin stretch-card">
											<div className="card">
												<div className="card-body">
													<h4 className="card-title">QR Del Activo</h4>
													<QRCode value={this.state.qrCode} />
												</div>
											</div>
										</div>
										: null
									}
                  <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title" id="card-title-activo">Registrar Activo</h4>
                          <form className="form-sample">
                            <p className="card-description"> Asignacion de Activo </p>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Codigo</label>
                                  <div className="col-sm-9">
                                  <Form.Control  type="text" id="inputCodigo" placeholder="Nombre" required onChange={this.handleCodigo}/>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Fecha Incorporacion</label>
                                  <div className="col-sm-9">
                                  <Form.Control type="date" id="inputFechaIncorporacion" required defaultValue={this.state.fechaIncorporacion} onChange={this.handleFechaIncorporacion}/>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">UFV</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputUfvId" onChange={this.handleUfvId}>
                                        <option hidden value=''>Escoga una Opcion</option>
                                        {
                                            this.state.ufvs !== null ? 
                                            this.state.ufvs.map((index, key) => (
                                                <option value={index._id} key={key}>{index.valor}</option>
                                            ))
                                            : <option>Cargando...</option>
                                        }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Fecha de Registro</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="date" id="inputFechaRegistro" onChange={this.handleFechaRegistro} required defaultValue={this.state.fechaIncorporacion} disabled/>
                                    {/* <select className="form-control">
                                      <option>Male</option>
                                      <option>Female</option>
                                    </select> */}
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Grupo</label>
                                  <div className="col-sm-9">
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
                                  </div>
                                  </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Oficina</label>
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
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Auxiliar</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputAuxiliarId" onChange={this.handleAuxiliarId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.auxiliares !== null ? 
                                          this.state.auxiliares
																					.filter((index) => {
																						if(this.state.grupoId === ''){
																							return null
																						}else{
																							if(index.grupoId=== this.state.grupoId){
																								return index
																							}
																						}
																						return null
																					})
																					.map((index, key) => (
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
                                  <label className="col-sm-3 col-form-label">Responsable</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputUsuarioId" onChange={this.handleUsuarioId}>
																			<option hidden value=''>Escoga una Opcion</option>
																			{
                                        this.state.responsables !== null ? 
                                          this.state.responsables
																					.filter((index) => {
																						if(this.state.oficinaId === ''){
																							return null
																						}else{
																							if(index.oficinaId === this.state.oficinaId){
																								return index
																							}
																						}
																						return null
																					})
																					.map((index, key) => (
                                            <option value={index._id} key={key}>{index.nombre}</option>
                                          ))
                                        : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                  </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Estado Activo</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputEstadoActivo" onChange={this.handleEstadoActivo}>
                                      <option hidden value=''>Escoga una Opcion</option>
																			<option value='bueno'>Bueno</option>
																			<option value='regular'>Regular</option>
																			<option value='malo'>Malo</option>
                                    </select>
                                  </div>
                                  </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Cargo</label>
                                  <div className="col-sm-9">
                                  <Form.Control type="text" placeholder="Seleccione un Responsable" id="inputCargo" required disabled/>
                                  </div>
                                  </Form.Group>
                              </div>
                            </div>
                            <p className="card-description"> Datos de Activo </p>
                            <div className="row">
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Costo Inicial</label>
                                  <div className="col-sm-9">
                                  <Form.Control type="number" placeholder="0.00" step="any" id="inputCostoInicial" required onChange={this.handleCostoInicial}/>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">VIDA</label>
                                  <div className="col-sm-9">
                                  <Form.Control type="number" placeholder="En años" step="any" id="inputVida" required onChange={this.handleVida}/>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">COE</label>
                                  <div className="col-sm-9">
                                  <Form.Control type="number" placeholder="0% - 100%" step="1" min={1} max={100} id="inputCoe" required onChange={this.handleCoe}/>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Descripcion</label>
                                  <div className="col-sm-9">
                                  <textarea className="form-control" id="inputDescripcion" onChange={this.handleDescripcion} rows="5" placeholder="Descripcion Corta del Activo" required></textarea>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Observaciones</label>
                                  <div className="col-sm-9">
                                  <textarea className="form-control" id="inputObservaciones" onChange={this.handleObservaciones} rows="5" placeholder="Observaciones" required></textarea>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                                <button className="btn btn-light" onClick={this.handleReset}>Borrar Datos</button>
                                {
                                    this.state.error !== '' ? <label style={{color: 'red', fontSize: '0.875rem'}}>{this.state.error}</label> : null
                                }
                                </div>
                            </div>
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

export default Personal
