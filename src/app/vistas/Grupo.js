import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap'
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

export class Grupo extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isAuth: '',
          data: null,
          searchGrupo: '',
          request: 'false',
          auxiliares: null,
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
      this.getAuxiliares()
    }

    getData() {
      const response = async () => {
        await axios.get(nodeapi+'grupos')
        .then(res => this.setState({data: res.data}))
        .catch(err => console.log(err))
      }
      response()
    }

    getAuxiliares() {
      const response = async () => {
        await axios.get(nodeapi+`auxiliares`)
        .then(res => {
          this.setState({auxiliares: res.data})
        })
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
                      <h3 className="page-title"> Grupos </h3>
                      <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                          <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                          <li className="breadcrumb-item active" aria-current="page">Grupos</li>
                          </ol>
                      </nav>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card" style={{marginBottom: '0px'}}>
                      <div className="form-group" style={{width: '100%'}}>
                        <input type="search" className="form-control" placeholder="Buscar" onChange={(event) => this.setState({searchGrupo: event.target.value})}/>
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
                                  <th>Vida</th>
                                  <th>Cantidad</th>
                                  <th>Estado</th>
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
                                        <td>{index.nombre}</td>
                                        <td>{index.codigo}</td>
                                        <td>{index.vida}</td>
                                        <td>
                                        {
                                          this.state.auxiliares !== null && this.state.auxiliares.filter(item => item.grupoId === index._id).length !== undefined ?
                                          <> 
                                          <ProgressBar variant="success" max={50} style={{minWidth: '100px'}} now={this.state.auxiliares.filter(item => item.grupoId === index._id).length}/>
                                          <label style={{float: 'right', color: '#19d895', fontSize: '13px'}}>{this.state.auxiliares.filter(item => item.grupoId === index._id).length}</label>
                                          </>
                                          :
                                          null
                                        }
                                        </td>
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

export default Grupo
