import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

import image1 from '../../assets/images/faces/face-default.jpg'
import logo from '../reportes/resized.png'
import minilogo from '../reportes/minilogo.png'
import { Views } from '../../views/Views'

class Sidebar extends Component {

  constructor(props) {
    super(props)
    this.user = {
      isAdmin: '',
      username: '',
      role: null,
      roleId: '',
      permissions: null,
      views: null,
    }
  }

  state = {
  };

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
    this.setState({
      username: this.state.username,
      role: this.state.role,
      roleId: this.state.roleId,
      views: this.state.views,
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/form-elements', state: 'formElementsMenuOpen' },
      { path: '/tables', state: 'tablesMenuOpen' },
      { path: '/icons', state: 'iconsMenuOpen' },
      { path: '/charts', state: 'chartsMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
      { path: '/error-pages', state: 'errorPagesMenuOpen' },
      { path: '/administracion', state: 'administracionMenuOpen' },
      { path: '/vistas', state: 'vistasMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

    this.setState({
      username: this.state.username,
      role: this.state.role,
      roleId: this.state.roleId,
      views: this.state.views,
    })

  }

  checkToken() {
    const token = window.localStorage.getItem('token')
    if (token) {
      this.verifytoken()
    } else {
      this.props.history.push('/login')
    }
  }

  async verifytoken() {
    const data = {
      token: window.localStorage.getItem('token')
    }
    if (data.token) {
      await axios.post(nodeapi + 'users/verify', data)
        .then(async res => {
          if (res.data.status === 'ok') {
            const roleId = this.decodeToken(data.token).role
            this.setState({ username: this.decodeToken(data.token).username })
            await this.getRole(roleId);
            const viewsPermissions = [
              
              {
                name: 'Roles',
                viewId: Views.roles,
                isVisible: await this.getPermissions(roleId, Views.roles),
              },
              {
                name: 'Cargos',
                viewId: Views.cargos,
                isVisible: await this.getPermissions(roleId, Views.cargos), 
              },
              {
                name: 'Departamentos',
                viewId: Views.departamentos,
                isVisible: await this.getPermissions(roleId, Views.departamentos),
              },
              {
                name: 'Personal',
                viewId: Views.personal,
                isVisible: await this.getPermissions(roleId, Views.personal),
              },
              {
                name: 'Grupos',
                viewId: Views.grupos,
                isVisible: await this.getPermissions(roleId, Views.grupos),
              },
              {
                name: 'Auxiliares',
                viewId: Views.auxiliares,
                isVisible: await this.getPermissions(roleId, Views.auxiliares),
              },
              {
                name: 'Ufv',
                viewId: Views.ufv,
                isVisible: await this.getPermissions(roleId, Views.ufv),
              },
              {
                name: 'Activos',
                viewId: Views.activos,
                isVisible: await this.getPermissions(roleId, Views.activos),
              },
              
            ]
            this.setState({ views: viewsPermissions })
          } else {
            window.localStorage.removeItem('token');
          }
        })
        .catch(err => err)
    }
  }

  async getRole(roleId) {
    await axios.get(`${nodeapi}roles/${roleId}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            role: res.data.name,
            roleId: res.data._id,
          });
        }
      })
  }

  async getPermissions(roleId, viewId) {
    const permission = await axios.get(`${nodeapi}roleviews/find`, {
      params: {
        roleId,
        viewId
      }
    })
      .then(res => {
        if (res.status === 200) {
          return res.data.isVisible;
        }
      })
    return permission;
  }

  decodeToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  componentDidMount() {
    this.checkToken()
    this.onRouteChanged();
    // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="text-center sidebar-brand-wrapper d-flex align-items-center">
          <a className="sidebar-brand brand-logo" href="/inicio"><img src={logo} alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini pt-3" href="/inicio"><img src={minilogo} alt="logo" /></a>
        </div>
        <ul className="nav">
          <li className="nav-item nav-profile not-navigation-link">
            <div className="nav-link">
              <Dropdown>
                <Dropdown.Toggle className="nav-link user-switch-dropdown-toggler p-0 toggle-arrow-hide bg-transparent border-0 w-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="profile-image">
                      <img className="img-xs rounded-circle" src={image1} alt="profile" />
                      <div className="dot-indicator bg-success"></div>
                    </div>
                    <div className="text-wrapper">
                      <p className="profile-name">{this.state.username !== '' ? this.state.username : 'error'}</p>
                      <p className="designation">{this.state.role === null ? 'Error' : this.state.role}</p>
                    </div>

                  </div>
                </Dropdown.Toggle>
                {/* <Dropdown.Menu className="preview-list navbar-dropdown">
                  <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center" href="!#" onClick={evt =>evt.preventDefault()}>
                    <div className="d-flex">
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-bookmark-plus-outline mr-0"></i>
                      </div>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center border-left border-right">
                        <i className="mdi mdi-account-outline mr-0"></i>
                      </div>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-alarm-check mr-0"></i>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Manage Accounts</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Change Password</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Check Inbox</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Sign Out</Trans>
                  </Dropdown.Item>
                </Dropdown.Menu> */}
              </Dropdown>
            </div>
          </li>

          <li className={this.isPathActive('/inicio') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/inicio">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Inicio</Trans></span>
            </Link>
          </li>
          {/* <li className={ this.isPathActive('/basic-ui') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('basicUiMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-crosshairs-gps menu-icon"></i>
              <span className="menu-title"><Trans>Basic UI Elements</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.basicUiMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/buttons') ? 'nav-link active' : 'nav-link' } to="/basic-ui/buttons"><Trans>Buttons</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/dropdowns') ? 'nav-link active' : 'nav-link' } to="/basic-ui/dropdowns"><Trans>Dropdowns</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/form-elements') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('formElementsMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title"><Trans>Form Elements</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.formElementsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/form-elements/basic-elements') ? 'nav-link active' : 'nav-link' } to="/form-elements/basic-elements"><Trans>Basic Elements</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/tables') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('tablesMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-table-large menu-icon"></i>
              <span className="menu-title"><Trans>Tables</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.tablesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link' } to="/tables/basic-table"><Trans>Basic Table</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/icons') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.iconsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('iconsMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-account-box-outline menu-icon"></i>
              <span className="menu-title"><Trans>Icons</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.iconsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/icons/mdi') ? 'nav-link active' : 'nav-link' } to="/icons/mdi">Material</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/charts') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.chartsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('chartsMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-chart-line menu-icon"></i>
              <span className="menu-title"><Trans>Charts</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.chartsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/charts/chart-js') ? 'nav-link active' : 'nav-link' } to="/charts/chart-js">Chart Js</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/user-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.userPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('userPagesMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-lock-outline menu-icon"></i>
              <span className="menu-title"><Trans>User Pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.userPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/login-1') ? 'nav-link active' : 'nav-link' } to="/user-pages/login-1"><Trans>Login</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/register-1') ? 'nav-link active' : 'nav-link' } to="/user-pages/register-1"><Trans>Register</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/error-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.errorPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('errorPagesMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-information-outline menu-icon"></i>
              <span className="menu-title"><Trans>Error Pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.errorPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/error-pages/error-404') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-404">404</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/error-pages/error-500') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-500">500</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="http://www.bootstrapdash.com/demo/star-admin-free/react/documentation/documentation.html" rel="noopener noreferrer" target="_blank">
              <i className="mdi mdi-file-outline menu-icon"></i>
              <span className="menu-title"><Trans>Documentation</Trans></span>
            </a>
          </li> */}
          <li className={this.isPathActive('/administracion') ? 'nav-item active' : 'nav-item'} id="liAdmin">
            <div className={this.state.administracionMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('administracionMenuOpen')} data-toggle="collapse">
              <i className="mdi mdi-information-outline menu-icon"></i>
              <span className="menu-title"><Trans>Administracion</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.administracionMenuOpen}>
              <ul className="nav flex-column sub-menu">
                {
                  this.state.views !== undefined ? (
                    this.state.views.map((item) => {
                      if (item.isVisible) {
                        return <li key={item.viewId} className="nav-item"> <Link className={this.isPathActive(`/administracion/${item.name}`) ? 'nav-link active' : 'nav-link'} to={`/administracion/${item.name}`}>{item.name}</Link></li>
                      }
                      return null;
                    })
                  ) : null
                }
                {/* <li className="nav-item"> <Link className={ this.isPathActive('/administracion/oficinas') ? 'nav-link active' : 'nav-link' } to="/administracion/oficinas">Oficinas</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/administracion/personal') ? 'nav-link active' : 'nav-link' } to="/administracion/personal">Personal</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/administracion/grupos') ? 'nav-link active' : 'nav-link' } to="/administracion/grupos">Grupos</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/administracion/auxiliares') ? 'nav-link active' : 'nav-link' } to="/administracion/auxiliares">Auxiliares</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/administracion/ufv') ? 'nav-link active' : 'nav-link' } to="/administracion/ufv">UFV</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/administracion/activos') ? 'nav-link active' : 'nav-link' } to="/administracion/activos">Activos</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/administracion/roles') ? 'nav-link active' : 'nav-link' } to="/administracion/roles">Roles</Link></li> */}
                {/* <li className="nav-item"> <Link className={ this.isPathActive('/error-pages/error-500') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-500">500</Link></li> */}
              </ul>
            </Collapse>
          </li>
          {/*<li className={this.isPathActive('/vistas') ? 'nav-item active' : 'nav-item'} id="liVistas">
            <div className={this.state.vistasMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('vistasMenuOpen')} data-toggle="collapse">
              <i className="mdi mdi-information-outline menu-icon"></i>
              <span className="menu-title"><Trans>Vistas</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.vistasMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/visas/oficinas') ? 'nav-link active' : 'nav-link'} to="/vistas/oficinas">Oficinas</Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/vistas/personal') ? 'nav-link active' : 'nav-link'} to="/vistas/personal">Personal</Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/vistas/grupos') ? 'nav-link active' : 'nav-link'} to="/vistas/grupos">Grupos</Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/vistas/auxiliares') ? 'nav-link active' : 'nav-link'} to="/vistas/auxiliares">Auxiliares</Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/vistas/ufv') ? 'nav-link active' : 'nav-link'} to="/vistas/ufv">UFV</Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/vistas/activos') ? 'nav-link active' : 'nav-link'} to="/vistas/activos">Activos</Link></li>
              </ul>
            </Collapse>
          </li>*/}
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

}

export default withRouter(Sidebar);