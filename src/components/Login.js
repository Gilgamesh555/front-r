// import logo from '../logo.svg';
import axios from 'axios';
import { Component } from 'react';
import nodeapi from '../apis/nodeapi'
import {Redirect} from 'react-router-dom'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      isAuth: 'none',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangePasswd = this.handleChangePasswd.bind(this)
  }

  componentDidMount(){ 
    const token = window.localStorage.getItem('token')
    if(token) {
      this.verifytoken()
    }
  }

  async verifytoken() {
    const data = {
      token: window.localStorage.getItem('token')
    }
    await axios.post(nodeapi+'users/verify', data)
    .then(res => {
      if(res.data.status === 'ok'){
        // this.props.history.push('/inicio')
        this.setState({isAuth: 'correct'})
      }else{
        window.localStorage.removeItem('token')
        this.setState({isAuth: 'failed'})
      }
    })
    .catch(err => console.log(err))
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
          this.setState({isAuth: 'failed'})
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
    const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }

    if(this.state.isAuth === 'correct') {
      return(
        <Redirect to={`${from}`}/>
      )
    } else {
      return (
        <section className="ftco-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center mb-5">
                <h2 className="heading-section">Sistema De Activos</h2>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-7 col-lg-5">
                <div className="login-wrap p-4 p-md-5">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="fa fa-user-o"></span>
                  </div>
                  <h3 className="text-center mb-4">Iniciar Sesion</h3>
                  <form className="login-form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <input className="form-control rounded-left" type="text" placeholder="Nombre de Usuario" value={this.state.username} required onChange={this.handleChange}/>
                    </div>
                    <div className="form-group d-flex">
                      <input className="form-control rounded-left" type="password" placeholder="Contrasena" required onChange={this.handleChangePasswd}/>
                    </div>
                    <div className="form-group">
                      <button className="form-control btn btn-primary rounded submit px-3" type="submit">Iniciar Sesion</button>
                    </div>
                    {
                      this.state.isAuth === 'failed' ?
                      <div className="form-group d-md-flex">
                        <div className="w-100">
                          <p style={{fontSize: '13px', color: 'red'}}>Nombre de Usuario o Contrasena Incorrectos</p>
                        </div>
                      </div> : 
                      <></>
                    }
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }
}

export default App;
