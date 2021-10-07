import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

export class Oficina extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isAuth: '',
        }
    }

    checkToken() {
      const token = window.localStorage.getItem('token')
      if(token) {
        this.verifytoken()
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
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }

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
                      <h3 className="page-title"> Oficinas </h3>
                      <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                          <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                          <li className="breadcrumb-item active" aria-current="page">Oficinas</li>
                          </ol>
                      </nav>
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
                                  <th colSpan={3}>Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Jacob</td>
                                  <td>Photoshop</td>
                                  <td className="text-danger"> Inactivo <i className="mdi mdi-arrow-down"></i></td>
                                  <td>
                                    <a href="!#" onClick={evt =>evt.preventDefault()} className="badge badge-warning" style={{marginRight: '3px'}} >Modificar</a>
                                    <a href="!#" className="badge badge-info" style={{marginRight: '3px'}}>Cambiar Estado</a>
                                    <a href="!#" className="badge badge-danger" style={{marginRight: '3px'}}>Eliminar</a>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Jacob</td>
                                  <td>Photoshop</td>
                                  <td className="text-success"> Activo <i className="mdi mdi-arrow-up"></i></td>
                                  <td>
                                    <a href="!#" className="badge badge-warning" style={{marginRight: '3px'}} >Modificar</a>
                                    <a href="!#" className="badge badge-info" style={{marginRight: '3px'}}>Cambiar Estado</a>
                                    <a href="!#" className="badge badge-danger" style={{marginRight: '3px'}}>Eliminar</a>
                                  </td>
                                </tr>
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
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title">Registrar Oficina</h4>
                          <p className="card-description">Todos los campos deben estar llenos</p>
                          <form className="forms-sample">
                            <Form.Group>
                              <label htmlFor="exampleInputUsername1">Nombre de Oficina</label>
                              <Form.Control type="text" id="exampleInputUsername1" placeholder="Nombre de Oficina" size="lg" required/>
                            </Form.Group>
                            <Form.Group>
                              <label htmlFor="exampleInputEmail1">Codigo</label>
                              <Form.Control type="Codigo" className="form-control" id="exampleInputEmail1" placeholder="Codigo" required/>
                            </Form.Group>
                            {/* <div className="form-check">
                              <label className="form-check-label text-muted">
                                <input type="checkbox" className="form-check-input"/>
                                <i className="input-helper"></i>
                                Remember me
                              </label>
                            </div> */}
                            <button type="submit" className="btn btn-primary mr-2">Enviar</button>
                            <button className="btn btn-light">Borrar Datos</button>
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
