import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// import '../styles/login.css'
import './App.scss'
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';
import { withTranslation } from "react-i18next";

import axios from 'axios'
import nodeapi from '../apis/nodeapi'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isAuth: '',
    }
  }

  checkToken() {
    const token = window.localStorage.getItem('token')
    if(token) {
      this.verifytoken()
    } else {
      this.setState({isAuth: 'failed'})
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

  state = {}

  componentDidMount() {
    this.checkToken();
    this.onRouteChanged();
  }


  render () {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar/> : '';
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar/> : '';
    let SettingsPanelComponent = !this.state.isFullPageLayout ? <SettingsPanel/> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer/> : '';
    if(this.state.isAuth === ''){
      return (
        <div className="page-body-wrapper">  
        </div>      
      )
    }else{
      if(this.state.isAuth === 'correct'){
        return(
        <div className="container-scroller">
          { navbarComponent }
          <div className={`container-fluid page-body-wrapper ${this.state.isFullPageLayout === true ? 'full-page-wrapper' : ''}`}>
            { sidebarComponent }
            <div className="main-panel">
              <div className="content-wrapper">
                <AppRoutes/>
                { SettingsPanelComponent }
              </div>
              { footerComponent }
            </div>
          </div>
        </div>
        )
      } else {
        return(
        <div className="container-scroller">
          {/* { navbarComponent } */}
          <div className={`container-fluid page-body-wrapper ${this.state.isFullPageLayout === true ? 'full-page-wrapper' : ''}`}>
            {/* { sidebarComponent } */}
            <div className="main-panel">
              <div className="content-wrapper">
                <AppRoutes/>
                {/* { SettingsPanelComponent } */}
              </div>
              {/* { footerComponent } */}
            </div>
          </div>
        </div>
        )
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.checkToken();
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED");
    // const { i18n } = this.props;
    const body = document.querySelector('body');
    if(this.props.location.pathname === '/layout/RtlLayout') {
      body.classList.add('rtl');
      // i18n.changeLanguage('ar');
    }
    else {
      body.classList.remove('rtl')
      // i18n.changeLanguage('en');
    }
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['/user-pages/login-1', '/user-pages/login-2', '/user-pages/register-1', '/user-pages/register-2', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page', '/login', '/'];
    for ( let i = 0; i < fullPageLayoutRoutes.length; i++ ) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true
        })
        document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
        break;
      } else {
        this.setState({
          isFullPageLayout: false
        })
        document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
      }
    }
  }

}

export default withTranslation()(withRouter(App));
