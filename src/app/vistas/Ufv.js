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
          data: null,
          searchUfv: '',
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
    }

    getData() {
      const response = async () => {
        await axios.get(nodeapi+'ufv')
        .then(res => this.setState({data: res.data}))
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
                      <h3 className="page-title"> UFV </h3>
                      <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                          <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                          <li className="breadcrumb-item active" aria-current="page">Ufv</li>
                          </ol>
                      </nav>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card" style={{marginBottom: '0px'}}>
                      <div className="form-group" style={{width: '100%'}}>
                        <input type="search" className="form-control" placeholder="Buscar" onChange={(event) => this.setState({searchUfv: event.target.value})}/>
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
                                </tr>
                              </thead>
                              <tbody>
                                  {
                                    this.state.data !== null ? 
                                    this.state.data
                                    .filter((index) => {
                                      if(this.state.searchUfv === ''){
                                        return index
                                      }else{
                                        if(index.fecha.toLowerCase().includes(this.state.searchUfv.toLocaleLowerCase()) || index.valor.toLowerCase().includes(this.state.searchUfv.toLocaleLowerCase())){
                                          return index
                                        }
                                      }
                                      return null
                                    })
                                    .map((index, key) => (
                                      <tr key={key}>
                                        <td>{index.fecha}</td>
                                        <td>{index.valor}</td>
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

export default Ufv
