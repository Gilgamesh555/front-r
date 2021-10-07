// import logo from '../logo.svg';
import axios from 'axios';
import { Component } from 'react';
import '../styles/login.css'
import nodeapi from '../apis/nodeapi'
class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount(){
    const token = window.localStorage.getItem('token')
    if(token) {
      this.verifytoken()
    } else {
      this.props.history.push('/')
    }
  }

  async verifytoken() {
    const data = {
      token: window.localStorage.getItem('token')
    }
    await axios.post(nodeapi+'users/verify', data)
    .then(res => {
      if(res.data.status === 'ok'){
        // Add some code to refresh the token
      }else{
        window.localStorage.removeItem('token')
        this.props.history.push({pathname: '/', state: {from: '/inicio'}})
      }
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <h1>GAAA</h1>
    );
  }
}

export default App;
