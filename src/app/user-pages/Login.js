import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'
import nodeapi from '../../apis/nodeapi'
import logo from '../reportes/resized.png'

export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      errorMsg: '',
      isAuth: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangePasswd = this.handleChangePasswd.bind(this)
  }

  componentDidMount(){ 
    const token = window.localStorage.getItem('token')
    if(token) {
      this.verifytoken()
    }else {
      this.setState({isAuth: 'false'})
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
      .catch(err => console.log(err))
    }
  }

  handleSubmit(event) {
    const data = {
      username: this.state.username,
      password: this.state.password
    }
    const response = async () => {
      await axios.post(nodeapi+'users/login', data)
      .then(res => {
        if(res.data.status === 'ok'){
          window.localStorage.setItem('token', res.data.data)
          this.setState({isAuth: 'correct'})
        }
        else{
          window.localStorage.removeItem('token')
          console.log(res.data);
          this.setState({isAuth: 'failed', errorMsg: res.data.error})
        }
      })
      .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
  }

  handleChange(event) {
    this.setState({username: event.target.value})
  }
  
  handleChangePasswd(event) {
    this.setState({password: event.target.value})
  }

  render() {
    if(this.state.isAuth === ''){
      return null
    }else{
      if(this.state.isAuth === 'correct'){
        const { from } = this.props.location.state || { from: { pathname: '/inicio' } }
        return (
          <Redirect to={{pathname: `${from.pathname}`, state: {isAuth: 'correct'}}}/>
        )
      }else{
        return (
          <div>
            <div className="d-flex align-items-center auth px-0">
              <div className="row w-100 mx-0">
                <div className="col-lg-4 mx-auto">
                  <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                    <div className="brand-logo">
                      <img src={logo} alt="logo" />
                    </div>
                    <h4>Sistema de Activos</h4>
                    <h6 className="font-weight-light">Inicio de Sesion</h6>
                    <Form className="pt-3">
                      <Form.Group className="d-flex search-field">
                        <Form.Control type="email" placeholder="Nombre de Usuario" size="lg" className="h-auto" defaultValue={this.state.username} onChange={this.handleChange} required/>
                      </Form.Group>
                      <Form.Group className="d-flex search-field">
                        <Form.Control type="password" placeholder="Contraseña" size="lg" className="h-auto" defaultValue={this.state.password} onChange={this.handleChangePasswd} required/>
                      </Form.Group>
                      <div className="mt-3">
                        {/* <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard">Iniciar Sesion</Link> */}
                        <Button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={this.handleSubmit} type="submit">Iniciar Sesion</Button>
                      </div>
                      {
                        this.state.isAuth === 'failed' ?
                        <p style={{color: 'red'}}>{this.state.errorMsg}</p>
                        : null
                      }
                      {/* <div className="my-2 d-flex justify-content-between align-items-center">
                        <div className="form-check">
                          <label className="form-check-label text-muted">
                            <input type="checkbox" className="form-check-input"/>
                            <i className="input-helper"></i>
                            Keep me signed in
                          </label>
                        </div>
                        <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-black">Forgot password?</a>
                      </div> */}
                      {/* <div className="mb-2">
                        <button type="button" className="btn btn-block btn-facebook auth-form-btn">
                          <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
                        </button>
                      </div> */}
                      {/* <div className="text-center mt-4 font-weight-light">
                        Don't have an account? <Link to="/user-pages/register" className="text-primary">Create</Link>
                      </div> */}
                    </Form>
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

export default Login
