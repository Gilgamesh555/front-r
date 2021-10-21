import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

export class Personal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isAuth: '',
          data: null,
          searchUser: '',
          oficinas: null,
          request: 'false',
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
    }

    getData() {
      const response = async () => {
        await axios.get(nodeapi+'users')
        .then(res => this.setState({data: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

    getOficinas() {
      const response = async () => {
        await axios.get(nodeapi+'oficinas')
        .then(res => this.setState({oficinas: res.data}))
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
                      <h3 className="page-title"> Personal </h3>
                      <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                          <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                          <li className="breadcrumb-item active" aria-current="page">Personal</li>
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
                          <h4 className="card-title">Lista de Personal - Usuarios</h4>
                          {/* <p className="card-description"> Add className <code>.table-hover</code>
                          </p> */}
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Nombre</th>
                                  <th>Ap. Paterno</th>
                                  <th>Ap. Materno</th>
                                  <th>CI</th>
                                  <th>Oficina</th>
                                  <th>Cargo</th>
                                  <th>Email</th>
                                  <th>Nro Celular</th>
                                  <th>Estado</th>
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
                                        <td>{index.nombre}</td>
                                        <td>{index.apPaterno}</td>
                                        <td>{index.apMaterno}</td>
                                        <td>{index.ci}</td>
                                        <td>{
                                          this.state.oficinas !== null && this.state.oficinas.find(item => item._id === index.oficinaId) !== undefined ? 
                                          this.state.oficinas.find(item => item._id === index.oficinaId).nombre :
                                          null
                                        }</td>
                                        <td>{index.cargo}</td>
                                        <td>{index.email}</td>
                                        <td>{index.celular}</td>
                                        <td className={index.estado === 'activo' ? 'text-success' : 'text-danger'}> 
                                          {index.estado} <i className={index.estado === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
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
