import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));

const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));

const Mdi = lazy(() => import('./icons/Mdi'));

const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));

// Administracion
const Oficina = lazy(() => import('./administracion/Oficina'))
const Personal = lazy(() => import('./administracion/Personal'))
const Grupo = lazy(() => import('./administracion/Grupo'))
const Auxiliar = lazy(() => import('./administracion/Auxiliar'))
const Activo = lazy(() => import('./administracion/Activo'))
const Ufv = lazy(() => import('./administracion/Ufv'))
const Rol = lazy(() => import('./administracion/roles/Rol'))
const Cargo = lazy(() => import('./administracion/cargos/Cargo'))

const vistaOficina = lazy(() => import('./vistas/Oficina'))
const vistaPersonal = lazy(() => import('./vistas/Personal'))
const vistaGrupo = lazy(() => import('./vistas/Grupo'))
const vistaAuxiliar = lazy(() => import('./vistas/Auxiliar'))
const vistaActivo = lazy(() => import('./vistas/Activo'))
const vistaUfv = lazy(() => import('./vistas/Ufv'))

const Login = lazy(() => import('./user-pages/Login')); 
const Register1 = lazy(() => import('./user-pages/Register'));
const ActivoDetail = lazy(() => import('./user-pages/ActivoDetail'));


class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path="/inicio" component={ Dashboard } />

          <Route path="/basic-ui/buttons" component={ Buttons } />
          <Route path="/basic-ui/dropdowns" component={ Dropdowns } />

          <Route path="/form-Elements/basic-elements" component={ BasicElements } />

          <Route path="/tables/basic-table" component={ BasicTable } />

          <Route path="/icons/mdi" component={ Mdi } />

          <Route path="/charts/chart-js" component={ ChartJs } />


          <Route path="/login" component={ Login } />
          <Route path="/detailActivo" component={ ActivoDetail } />
          <Route path="/user-pages/register-1" component={ Register1 } />

          <Route path="/error-pages/error-404" component={ Error404 } />
          <Route path="/error-pages/error-500" component={ Error500 } />

          {/* ADMINISTRACION */}
          <Route path="/administracion/departamentos" component={ Oficina } />
          <Route path="/administracion/personal" component={ Personal } />
          <Route path="/administracion/grupos" component={ Grupo } />
          <Route path="/administracion/auxiliares" component={ Auxiliar } />
          <Route path="/administracion/activos" component={ Activo } />
          <Route path="/administracion/ufv" component={ Ufv } />
          <Route path="/administracion/roles" component={ Rol } />
          <Route path="/administracion/cargos" component={ Cargo } />

          {/* VISTAS */}
          <Route path="/vistas/oficinas" component={ vistaOficina } />
          <Route path="/vistas/personal" component={ vistaPersonal } />
          <Route path="/vistas/grupos" component={ vistaGrupo } />
          <Route path="/vistas/auxiliares" component={ vistaAuxiliar } />
          <Route path="/vistas/activos" component={ vistaActivo } />
          <Route path="/vistas/ufv" component={ vistaUfv } />

          <Route exact path="/" component={Login} />

          <Redirect to="/error-pages/error-404" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;