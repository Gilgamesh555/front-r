import React, { Component } from 'react'
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
          userData: null,
        }
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
            this.setState({userData: this.decodeToken(data.token)})
            this.setState({isAuth: 'correct'})
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
      this.getOficinas()
			this.getGrupos()
			this.getAuxiliares()
			this.getResponsables()
      this.getUfv()
    }

    getData() {
      const response = async () => {
        await axios.get(nodeapi+'activos')
        .then(res => this.setState({data: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

		generateQR(event, data) {
      // Auxiliar - Responsable Descripcion

      if(this.state.qrCode !== ''){
        this.setState({qrCode: ''})
      }else {
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
      }
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
                    <div className="col-lg-12 grid-margin stretch-card" style={{marginBottom: '0px'}}>
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
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Codigo</th>
                                  {/* <th>Fecha Incorporacion</th>
                                  <th>Fecha Registro</th> */}
                                  {/* <th>UFV</th> */}
                                  <th>Grupo</th>
                                  <th>Auxiliar</th>
                                  <th>Oficina</th>
                                  <th>Responsable</th>
                                  <th>Estado Activo</th>
                                  <th>Costo Inicial</th>
																	<th>Estado</th>
                                  <th>Otros</th>
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
                                        if(index.codigo.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase()) || index.costoInicial.toLowerCase().includes(this.state.searchUser.toLocaleLowerCase())){
                                          return index
                                        }
                                      }
                                      return null
                                    })
                                    .map((index, key) => (
                                      <tr key={key}>
                                        <td>{index.codigo}</td>
                                        {/* <td>{index.fechaIncorporacion}</td>
                                        <td>{index.fechaRegistro}</td> */}
                                        {/* <td>{
                                          this.state.ufvs !== null && this.state.ufvs.find(item => item._id === index.ufvId) !== undefined ? 
                                          this.state.ufvs.find(item => item._id === index.ufvId).valor :
                                          null
                                        }</td> */}
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
                                        </td>
                                      </tr>
                                    ))
                                    : null
                                  }
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
                    <div className="col-lg-12 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title">Mis Activos</h4>
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Codigo</th>
                                  {/* <th>Fecha Incorporacion</th>
                                  <th>Fecha Registro</th> */}
                                  {/* <th>UFV</th> */}
                                  <th>Grupo</th>
                                  <th>Auxiliar</th>
                                  <th>Oficina</th>
                                  <th>Responsable</th>
                                  <th>Estado Activo</th>
                                  <th>Costo Inicial</th>
																	<th>Estado</th>
                                  <th>Otros</th>
                                </tr>
                              </thead>
                              <tbody>
                                  {
                                    this.state.data !== null ? 
                                    this.state.data
                                    .filter((index) => {
                                      if(this.state.userData !== null && this.state.userData.id === index.usuarioId){
                                        return index
                                      }
                                      return null;
                                    })
                                    .map((index, key) => (
                                      <tr key={key}>
                                        <td>{index.codigo}</td>
                                        {/* <td>{index.fechaIncorporacion}</td>
                                        <td>{index.fechaRegistro}</td> */}
                                        {/* <td>{
                                          this.state.ufvs !== null && this.state.ufvs.find(item => item._id === index.ufvId) !== undefined ? 
                                          this.state.ufvs.find(item => item._id === index.ufvId).valor :
                                          null
                                        }</td> */}
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
                                        </td>
                                      </tr>
                                    ))
                                    : null
                                  }
                              </tbody>
                            </table>
                          </div>
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
