import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

export class Auxiliar extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isAuth: '',
          data: null,
          grupos: null,
          searchAuxiliar: '',
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
                    <div className="col-lg-12 grid-margin stretch-card" style={{marginBottom: '0px'}}>
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
                                  <th>Estado</th>
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
                                        {/* <td style={{whiteSpace: 'normal',maxWidth: '300px'}}>{index.descripcion}</td> */}
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

export default Auxiliar
