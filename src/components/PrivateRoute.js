import axios from "axios";
import nodeapi from '../apis/nodeapi'
import { Route } from "react-router";
import { Redirect } from 'react-router-dom'
import { Component, useState, useEffect } from "react";
import Dashboard from './Dashboard';

class PrivateRoute extends Component {
    constructor(props){
        super(props)
        this.state = {
            token: null
        }
    }

    componentDidMount() {

        const token = window.localStorage.getItem('token')

        if(token) {
            this.getData()
        }else{
            this.setState({token: {status: 'zzz'}})
        }
    }

    async getData() {
        const data = {
            token: window.localStorage.getItem('token')
        }


        await axios.post(nodeapi+'users/verify', data)
        .then(res => {
            this.setState({token: res.data})
            if(res.data.status === 'error'){
                window.localStorage.removeItem('token')
            }
        })
        .catch(err => console.log(err))
    }

    render() {

        if(this.state.token === null) return null

        if(this.state.token === 'zzz') return null

        return(
            <Route path={this.props.path} 
            render={(props) => { 
            // console.log(this.state.token.status)
            return this.state.token.status !== 'error' ? 
            <this.props.component {...props}/> :
            <Redirect {...this.setState({token: {status: 'zzz'}})} 
            {...window.localStorage.removeItem('token')}
            to={{
                pathname: "/",
                state: { from: props.location }
            }} /> 
            }} />
        )
    }
}

export default PrivateRoute