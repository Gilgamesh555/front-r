import React, { Component } from 'react';
import { Form, Modal, Button, Dropdown } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import UpdateActivo from './activo/updateActivo';
import DeprecateActivo from './activo/deprecateActivo';
// import DatePicker from "react-datepicker";

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'
import nodeimg from '../../apis/nodeimg'
// import QRCode from "react-qr-code";
import QRCode from 'qrcode.react'

import { PDFDownloadLink } from '@react-pdf/renderer'
import QrReport from '../reportes/QrReport'
import EstadoActivoReport from '../reportes/EstadoActivoReport'
import EstadoInactivosReport from '../reportes/EstadoInactivosReport'
import DisableActivo from './activo/DisableActivo';
import ActivoBajaReport from '../reportes/ActivoBajaReport';
import LogActivo from './activo/Log'
import { Views } from '../../views/Views';
import { passphrase } from '../../views/Passphrase';
import CryptoJS, { enc } from 'crypto-js';
import { ItemPagination } from './ItemPagination';

export class Personal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuth: '',
      codigo: '',
      fechaIncorporacion: '',
      fechaRegistro: '',
      ufvId: '',
      grupoId: '',
      auxiliarId: '',
      oficinaId: '',
      usuarioId: '',
      estadoActivo: '',
      costoInicial: '',
      observaciones: '',
      descripcion: '',
      coe: '',
      vida: '',
      imagePath: '',
      image: '',
      estado: '',
      error: '',
      id: '',
      data: null,
      searchUser: '',
      oficinas: null,
      grupos: null,
      auxiliares: null,
      responsables: null,
      ufvs: null,
      qrCode: '',
      request: 'false',
      auxiliarQr: '',
      responsableQr: '',
      qrSelectedInfo: "",
      isDeprecate: false,
      activoDeprecate: '',
      deprecateValue: null,
      isUpdate: false,
      isReevaluate: false,
      actualItemReevaluate: null,
      activoUpdate: '',
      updateValue: null,
      show: false,
      modalActivo: null,
      viewId: Views.activos,
      permissions: null,
      changeToEdit: false,
      showLogModal: false,
      userLogged: null,
      showInactiveModal: false,
      inactiveModalData: null,
      showRegisterModal: false,
      showModifyModal: false,
      showQrModal: false,
      showReevaluateModal: false,
      currentPdfReportBaja: null,
      activosUrl: 'activos/all',
    }
    // Register User
    this.handleCodigo = this.handleCodigo.bind(this)
    this.handleFechaIncorporacion = this.handleFechaIncorporacion.bind(this)
    this.handleFechaRegistro = this.handleFechaRegistro.bind(this)
    this.handleUfvId = this.handleUfvId.bind(this)
    this.handleGrupoId = this.handleGrupoId.bind(this)
    this.handleAuxiliarId = this.handleAuxiliarId.bind(this)
    this.handleOficinaId = this.handleOficinaId.bind(this)
    this.handleUsuarioId = this.handleUsuarioId.bind(this)
    this.handleEstadoActivo = this.handleEstadoActivo.bind(this)
    this.handleCostoInicial = this.handleCostoInicial.bind(this)
    this.handleObservaciones = this.handleObservaciones.bind(this)
    this.handleDescripcion = this.handleDescripcion.bind(this)
    this.handleVida = this.handleVida.bind(this)
    this.handleCoe = this.handleCoe.bind(this)

    // Form Handler
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.modifyActivo = this.modifyActivo.bind(this)

    this.changeEstado = this.changeEstado.bind(this)
    this.deleteActivo = this.deleteActivo.bind(this)
    this.registerActivo = this.registerActivo.bind(this)
    this.getOficinas = this.getOficinas.bind(this)
    this.generateQR = this.generateQR.bind(this)
    this.deprecateActivo = this.deprecateActivo.bind(this)
    this.updateAcivo = this.updateAcivo.bind(this)
    this.handleImagePath = this.handleImagePath.bind(this)
  }

  handleCodigo(event) {
    this.setState({ codigo: event.target.value })
  }

  handleFechaIncorporacion(event) {
    this.setState({ fechaIncorporacion: event.target.value })
    this.getUfvDate(event.target.value)
  }

  getUfvDate(date) {
    const data = {
      fecha: date,
    }
    const response = async () => {
      await axios.post(nodeapi + `ufv/date`, data)
        .then(res => {
          if (res.data !== null) {
            document.getElementById('inputUfvId').value = res.data.valor
            this.setState({ ufvId: res.data._id })
          } else {
            document.getElementById('inputUfvId').value = 'Seleccione Una fecha Valida'
            this.setState({ ufvId: '' })
          }
        })
        .catch(err => console.log(err))
    }
    response()
  }

  handleFechaRegistro(event) {
    this.setState({ fechaRegistro: event.target.value })
  }

  handleUfvId(event) {
    this.setState({ ufvId: event.target.value })
  }

  handleGrupoId(event) {
    this.setState({ grupoId: event.target.value })
    document.getElementById('inputAuxiliarId').value = ''
    const data = {
      _id: event.target.value,
    }
    const response = async () => {
      await axios.get(nodeapi + `grupos/${data._id}`)
        .then(res => {
          document.getElementById('inputCoe').value = res.data.coe
          document.getElementById('inputVida').value = res.data.vida
        })
        .catch(err => console.log(err))
    }
    response()
  }

  handleAuxiliarId(event) {
    this.setState({ auxiliarId: event.target.value })
  }

  handleOficinaId(event) {
    this.setState({ oficinaId: event.target.value })
    // document.getElementById('inputUsuarioId').value = ''
  }

  handleUsuarioId(event) {
    this.setState({ usuarioId: event.target.value })
    let cargoId = '';
    const response = async () => {
      await axios.get(nodeapi + `users/${event.target.value}`)
        .then(res => {
          cargoId = res.data.cargo;
        })
        .then(async res => {
          const cargoName = await axios.get(`${nodeapi}cargos/${cargoId}`);
          document.getElementById('inputCargo').value = cargoName.data.name;
        })
        .catch(err => console.log(err))
    }
    response()
  }

  handleEstadoActivo(event) {
    this.setState({ estadoActivo: event.target.value })
  }

  handleCostoInicial(event) {
    this.setState({ costoInicial: event.target.value })
  }

  handleObservaciones(event) {
    this.setState({ observaciones: event.target.value })
  }

  handleDescripcion(event) {
    this.setState({ descripcion: event.target.value })
  }

  handleCoe(event) {
    this.setState({ coe: event.target.value })
  }

  handleVida(event) {
    this.setState({ vida: event.target.value })
  }

  handleImagePath(event) {
    this.setState({ imagePath: event.target.files[0] })
    var file = event.target.files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = function (e) {
      this.setState({ image: [reader.result] })
    }.bind(this)
  }

  handleRegisterSubmit(event) {
    var text = document.getElementById('card-title-activo').textContent
    if (text === 'Modificar Activo') {
      const data = {
        codigo: this.state.codigo,
        fechaIncorporacion: this.state.fechaIncorporacion,
        fechaRegistro: this.state.fechaRegistro,
        ufvId: this.state.ufvId,
        grupoId: this.state.grupoId,
        auxiliarId: this.state.auxiliarId,
        oficinaId: this.state.oficinaId,
        usuarioId: this.state.usuarioId,
        estadoActivo: this.state.estadoActivo,
        costoInicial: this.state.costoInicial,
        observaciones: this.state.observaciones,
        descripcion: this.state.descripcion,
        vida: this.state.vida,
        coe: this.state.coe,
        estado: this.state.estado,
        _id: this.state.id,
        imagePath: this.state.imagePath,
      }

      var form_data = new FormData()

      for (var key in data) {
        form_data.append(key, data[key])
      }

      const response = async () => {
        await axios.put(nodeapi + `activos/${data._id}`, form_data)
          .then(res => {
            if (res.data.error) {
              if (res.data.error === 11000) {
                console.log(res.data.errmsg);
                if (res.data.errmsg.includes('email')) {
                  this.setState({ error: 'Email Ya en uso' })
                } else {
                  this.setState({ error: 'Codigo Ya en uso' })
                }
              } else {
                this.setState({ error: res.data.error })
              }
            } else {
              console.log(res.data.msg)
              this.setState({ request: 'true' })
            }
          })
          .catch(err => console.log(err))
      }
      response()
    } else {
      const data = {
        codigo: this.state.codigo,
        fechaIncorporacion: this.state.fechaIncorporacion,
        fechaRegistro: this.state.fechaRegistro,
        ufvId: this.state.ufvId,
        grupoId: this.state.grupoId,
        auxiliarId: this.state.auxiliarId,
        oficinaId: this.state.oficinaId,
        usuarioId: this.state.usuarioId,
        estadoActivo: this.state.estadoActivo,
        costoInicial: this.state.costoInicial,
        observaciones: this.state.observaciones,
        vida: this.state.vida,
        coe: this.state.coe,
        descripcion: this.state.descripcion,
        estado: 'activo',
        imagePath: this.state.imagePath,
      }

      var form_data = new FormData()

      for (var key in data) {
        form_data.append(key, data[key])
      }

      const response = async () => {
        await axios.post(nodeapi + 'activos', form_data)
          .then(res => {
            if (res.data.error) {
              if (res.data.error === 11000) {
                console.log(res.data.errmsg);
                if (res.data.errmsg.includes('email')) {
                  this.setState({ error: 'Email Ya en uso' })
                } else {
                  this.setState({ error: 'Codigo Ya en uso' })
                }
              } else {
                this.setState({ error: res.data.error })
              }
            } else {
              console.log(res.data.msg)
              this.setState({ request: 'true' })
            }
          })
          .catch(err => console.log(err))
      }
      if (this.state.confirmPassword === this.state.password) {
        response()
      } else {
        this.setState({ error: 'Las contraseñas no coinciden' })
      }
    }
    event.preventDefault()
  }

  handleReset(event) {
    document.getElementById('inputCodigo').value = ''
    document.getElementById('inputCargo').value = 'Seleccione Un Responsable'
    document.getElementById('inputUfvId').value = 'Seleccione Una Fecha de Incorporacion Valida'
    document.getElementById('inputGrupoId').value = ''
    document.getElementById('inputAuxiliarId').value = ''
    document.getElementById('inputOficinaId').value = ''
    document.getElementById('inputUsuarioId').value = ''
    document.getElementById('inputEstadoActivo').value = ''
    document.getElementById('inputCostoInicial').value = ''
    document.getElementById('inputObservaciones').value = ''
    document.getElementById('inputDescripcion').value = ''
    document.getElementById('inputVida').value = ''
    document.getElementById('inputCoe').value = ''
    document.getElementById('inputFechaIncorporacion').value = ''
    document.getElementById('imgContainer').src = 'https://www.kenyons.com/wp-content/uploads/2017/04/default-image.jpg'

    event.preventDefault()
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
            const roleId = this.decodeToken(data.token).role;
            this.setState({ userLogged: this.decodeToken(data.token) });
            await this.getPermissions(roleId, this.state.viewId);
            if (!this.state.permissions.isVisible) {
              this.props.history.push('/');
            }
            this.setState({ isAuth: 'correct' })
          } else {
            window.localStorage.removeItem('token')
            this.setState({ isAuth: 'failed' })
            this.props.history.push('/login')
          }
        })
        .catch(err => err)
    }
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
          this.setState({
            permissions: res.data
          });
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
    this.getData()
    this.getOficinas()
    this.getGrupos()
    this.getAuxiliares()
    this.getResponsables()
    this.getUfv()
    this.putDate()
  }

  getData() {
    const response = async () => {
      await axios.get(nodeapi + 'activos')
        .then(res => this.setState({ data: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  async getCurrentPdfReportBaja(id) {
    const res = await axios.get(`${nodeapi}activoBaja/byActivoId/${id}`)
    try {
      const { data } = res
      this.setState({ currentPdfReportBaja: data })
    } catch (error) {

    }
  }

  //crud
  modifyActivo(event, data) {
    event.preventDefault()
    this.setState({ showModifyModal: true }, () => {
      document.getElementById('imgContainer').src = nodeimg + data.imagePath
      document.getElementById('inputCodigo').value = data.codigo
      document.getElementById('inputCargo').value = ''
      // document.getElementById('inputUfvId').value = data.ufvId
      document.getElementById('inputGrupoId').value = data.grupoId
      document.getElementById('inputOficinaId').value = data.oficinaId
      document.getElementById('inputEstadoActivo').value = data.estadoActivo
      document.getElementById('inputCostoInicial').value = data.costoInicial
      document.getElementById('inputObservaciones').value = data.observaciones
      document.getElementById('inputDescripcion').value = data.descripcion
      // document.getElementById('inputVida').value = data.vida
      // document.getElementById('inputCoe').value = data.coe

      this.getUfvDate(data.fechaIncorporacion)

      var now = new Date(data.fechaRegistro);
      now.setMinutes(now.getDate());
      var date = now.toISOString().slice(0, 10);
      document.getElementById('inputFechaRegistro').value = date

      now = new Date(data.fechaIncorporacion);
      now.setMinutes(now.getDate());
      date = now.toISOString().slice(0, 10);
      document.getElementById('inputFechaIncorporacion').value = date

      document.getElementById('card-title-activo').innerHTML = 'Modificar Activo'
      document.getElementById('card-title-activo').style = 'color: red'

      this.setState({
        id: data._id,
        estado: data.estado,
        codigo: data.codigo,
        cargo: data.cargo,
        ufvId: data.ufvId,
        grupoId: data.grupoId,
        auxiliarId: data.auxiliarId,
        oficinaId: data.oficinaId,
        usuarioId: data.usuarioId,
        estadoActivo: data.estadoActivo,
        costoInicial: data.costoInicial,
        observaciones: data.observaciones,
        descripcion: data.descripcion,
        vida: data.vida, coe: data.coe,
        fechaIncorporacion: data.fechaIncorporacion,
        fechaRegistro: data.fechaRegistro,
        changeToEdit: !this.state.changeToEdit,
      }, function () {
        document.getElementById('inputUsuarioId').value = data.usuarioId
        document.getElementById('inputAuxiliarId').value = data.auxiliarId
      })
    })
  }

  changeEstado(event, datax) {
    const data = {
      estado: datax.estado === 'activo' ? 'inactivo' : 'activo',
      _id: datax._id,
      usuarioId: datax.usuarioId
    };
    const response = async () => {
      await axios.put(nodeapi + `activos/${data._id}/estado`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    event.preventDefault()
    if (datax.estado === 'inactivo') {
      response()
      window.location.reload()
    } else {
      this.setState({ showInactiveModal: true, inactiveModalData: data });
    }
  }

  deleteActivo(event, datax) {
    const data = {
      _id: datax._id
    }
    const response = async () => {
      await axios.delete(nodeapi + `activos/${data._id}`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
    window.location.reload()
  }

  generateQR(event, data) {
    // Auxiliar - Responsable Descripcion

    this.setState({ qrSelectedInfo: data });

    const response = async () => {
      await axios.get(nodeapi + 'auxiliares/' + data.auxiliarId)
        .then(res => this.setState({ auxiliarQr: res.data }, function () {
          const responseR = async () => {
            await axios.get(nodeapi + 'users/' + data.usuarioId)
              .then(res => this.setState({ responsableQr: res.data }, function () {
                const dataFormatted = {
                  codigo: data.codigo,
                  activo: this.state.auxiliarQr.nombre,
                  descripcion: data.descripcion,
                  responsable: `${this.state.responsableQr.nombre} ${this.state.responsableQr.apPaterno} ${this.state.responsableQr.apMaterno}`,
                  estado: data.estadoActivo
                };
                const dataEncrypted = JSON.stringify(dataFormatted);
                const encrypted = CryptoJS.AES.encrypt(dataEncrypted, passphrase).toString();
                console.log(encrypted);
                this.setShowQrModal();
                this.setState({ qrCode: encrypted })
              }))
              .catch(err => console.log(err))
          }
          responseR()
        }))
        .catch(err => console.log(err))
    }
    response()
    event.preventDefault()
  }

  registerActivo(event) {
    event.preventDefault()
    this.setShowRegisterModal();
  }

  getOficinas() {
    const response = async () => {
      await axios.get(nodeapi + 'oficinas')
        .then(res => this.setState({ oficinas: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  getGrupos() {
    const response = async () => {
      await axios.get(nodeapi + 'grupos')
        .then(res => this.setState({ grupos: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  getAuxiliares() {
    const response = async () => {
      await axios.get(nodeapi + 'auxiliares')
        .then(res => this.setState({ auxiliares: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  getResponsables() {
    const response = async () => {
      await axios.get(nodeapi + 'users')
        .then(res => this.setState({ responsables: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  getUfv() {
    const response = async () => {
      await axios.get(nodeapi + 'ufv')
        .then(res => this.setState({ ufvs: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  putDate() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var date = now.toISOString().slice(0, 10);
    this.setState({ fechaIncorporacion: date, fechaRegistro: date })
    const data = {
      fecha: date,
    }
    const response = async () => {
      await axios.post(nodeapi + `ufv/date`, data)
        .then(res => {
          if (res.data !== null) {
            document.getElementById('inputUfvId').value = res.data.valor
            this.setState({ ufvId: res.data._id })
          }
        })
        .catch(err => console.log(err))
    }
    response()
    //put Ufv in date if exists

  }

  reevaluateActivo(evt, item) {
    evt.preventDefault();
    this.setState({ isReevaluate: !this.state.isReevaluate })
    this.setState({ actualItemReevaluate: item })
    this.setShowReevaluateModal();
  }

  deprecateActivo(evt, data) {
    if (this.state.isDeprecate === true) {
      this.setState({ isDeprecate: false })
    } else {
      this.setState({ isDeprecate: true, activoDeprecate: data })
    }
    evt.preventDefault()
  }
  // Depreciacion de Valor de Activo
  deprecateValor() {
    var valor = this.state.activoDeprecate.costoInicial
    valor = parseFloat(valor)
    const data = {
      _id: this.state.activoDeprecate.grupoId
    }
    const response = async () => {
      await axios.get(nodeapi + `grupos/${data._id}`)
        .then(res => {
          var coe = parseInt(res.data.coe)
          coe = coe / 100
          valor = valor * coe
          this.setState({ deprecateValue: valor })
        })
        .catch(err => console.log(err))
    }
    response()
  }

  updateAcivo(evt, data) {
    //updateValue
    if (this.state.isUpdate === true) {
      this.setState({ isUpdate: false })
    } else {
      this.setState({ isUpdate: true, activoUpdate: data })
    }
    evt.preventDefault()
  }
  // Acualizar Valor de Activo
  updateValor() {
    var valor = this.state.activoUpdate.costoInicial
    valor = parseFloat(valor)
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var date = now.toISOString().slice(0, 10);
    const data = {
      fecha: date,
    }
    const response = async () => {
      await axios.post(nodeapi + `ufv/date`, data)
        .then(res => {
          if (res.data !== null) {
            const ufvF = parseFloat(res.data.valor)
            const resp = async () => {
              const data = {
                fecha: this.state.activoUpdate.fechaIncorporacion
              }
              await axios.post(nodeapi + `ufv/date`, data)
                .then(res => {
                  if (res.data !== null) {
                    const ufvI = parseFloat(res.data.valor)
                    valor = valor * (ufvF / ufvI - 1)
                    this.setState({ updateValue: valor })
                  }
                })
                .catch(err => console.log(err))
            }
            resp()
          }
        })
        .catch(err => console.log(err))
    }
    response()
  }

  onClickSearchButton(event) {
    // console.log(this.state.searchUser);
    this.setState({ activosUrl: `activos/search?searchInput=${this.state.searchUser}` })
    console.log(this.state.activosUrl)
    event.preventDefault();
  }

  setModalInfo(evt, data) {
    this.setState({ modalActivo: data })
    this.setState({ show: true })
    evt.preventDefault()
  }

  setModalInfoClose() {
    this.setState({ show: false })
  }

  setModalLogInfo(evt, data) {
    this.setState({ modalActivo: data })
    this.setState({ showLogModal: true })
    evt.preventDefault()
  }

  setModalLogClose() {
    this.setState({ showLogModal: false })
  }

  setModalDisableActivoClose() {
    this.setState({ showInactiveModal: false })
  }

  setShowRegisterModal() {
    this.setState({ showRegisterModal: true })
  }

  setShowRegisterModalClose() {
    this.setState({ showRegisterModal: false })
  }

  setShowModifyModal() {
    this.setState({ showRModifyModal: true })
  }

  setShowModifyModalClose() {
    this.setState({ showModifyModal: false })
  }

  setShowQrModal() {
    this.setState({ showQrModal: true })
  }

  setShowQrModalClose() {
    this.setState({ showQrModal: false })
  }

  setShowReevaluateModal() {
    this.setState({ showReevaluateModal: true })
  }

  setShowReevaluateModalClose() {
    this.setState({ showReevaluateModal: false })
  }

  getResponsable(user) {
    return `${user.nombre} ${user.apPaterno} ${user.apMaterno}`
  }

  render() {
    // const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }

    // Default Date
    // var now = new Date();
    // now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // var date = now.toISOString().slice(0,10);

    if (this.state.request === 'true') {
      window.location.reload()
    }

    if (this.state.isAuth === '') {
      return null
    } else {
      if (this.state.isAuth === 'failed') {
        return (
          <Redirect to={{ pathname: '/login' }} />
        )
      }
      else {
        return (
          <div>
            <div className="page-header">
              <h3 className="page-title"> Activos </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Activos</li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-lg-9 grid-margin stretch-card" style={{ marginBottom: '0px' }}>
                <div className="row form-group" style={{ width: '100%', marginLeft: '0' }}>
                  <input
                    type="search"
                    className="col-lg-5 form-control"
                    placeholder="Buscar"
                    onChange={(event) => this.setState({ searchUser: event.target.value })}
                  />
                  <button
                    type="submit"
                    className="col-lg-2 btn btn-primary mr-2"
                    onClick={(event) => this.onClickSearchButton(event)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>Buscar
                  </button>
                  {
                    this.state.permissions !== undefined &&
                    this.state.permissions.isAddble &&
                    (
                      <button
                        className='col-lg-2 btn badge-success mr-4'
                        onClick={evt => this.registerActivo(evt)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                          <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
                          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                        </svg>
                        Registrar Nuevo
                      </button>
                    )
                  }
                  {
                    this.state.permissions !== undefined &&
                    this.state.permissions.isEditable &&
                    (
                      <Dropdown className='col-lg-2 btn badge-warning mr-2'>
                        <Dropdown.Toggle className='badge-warning' variant="warning" id="dropdown-basic"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z" />
                        </svg>Reportes</Dropdown.Toggle>
                        <Dropdown.Menu>

                          {
                            this.state.permissions !== undefined &&
                            this.state.permissions.isEditable &&
                            <>
                              <Dropdown.Item href="#/action-3">
                                <a>
                                  <PDFDownloadLink
                                    document={<EstadoActivoReport />}
                                    fileName={`reporte-activo-actualizacion`}
                                    style={{
                                      color: '#000',
                                      backgroundColor: 'transparent'
                                    }}
                                  >
                                    Reporte Estado Activos
                                  </PDFDownloadLink>
                                </a>
                              </Dropdown.Item>
                              <Dropdown.Item href="#/action-3">
                                <a>
                                  <PDFDownloadLink
                                    document={<EstadoInactivosReport />}
                                    fileName={`reporte-activo-actualizacion`}
                                    style={{
                                      color: '#000',
                                      backgroundColor: 'transparent'
                                    }}
                                  >
                                    Reporte Estado Inactivos
                                  </PDFDownloadLink>
                                </a>
                              </Dropdown.Item>
                            </>
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Lista de Activos</h4>
                    {/* <p className="card-description"> Add className <code>.table-hover</code>
                          </p> */}
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Codigo</th>
                            {/* <th>Fecha Incorporacion</th>
                                  <th>Fecha Registro</th> */}
                            {/* <th>UFV</th> */}
                            {/*<th>Grupo</th>*/}
                            <th>Auxiliar</th>
                            <th>Departamento</th>
                            <th>Responsable</th>
                            {/*<th>Estado Activo</th>*/}
                            <th>Costo Inicial</th>
                            <th>Estado</th>
                            {/*<th>Operaciones</th>*/}
                            <th>Acciones</th>
                            <th>Otros</th>
                          </tr>
                        </thead>
                        <tbody>
                          <ItemPagination
                            url={this.state.activosUrl}
                            ItemComponent={({ item }) => {
                              return (
                                <tr>
                                  <td>{item.codigo}</td>
                                  {/* <td>{index.fechaIncorporacion}</td>
                                        <td>{index.fechaRegistro}</td> */}
                                  {/* <td>{
                                          this.state.ufvs !== null && this.state.ufvs.find(item => item._id === index.ufvId) !== undefined ? 
                                          this.state.ufvs.find(item => item._id === index.ufvId).valor :
                                          null
                                        }</td> */}
                                  {/*<td>{
                                          this.state.grupos !== null && this.state.grupos.find(item => item._id === index.grupoId) !== undefined ? 
                                          this.state.grupos.find(item => item._id === index.grupoId).nombre :
                                          null
                                        }</td>*/}
                                  <td>{
                                    this.state.auxiliares !== null && this.state.auxiliares.find(itemz => itemz._id === item.auxiliarId) !== undefined ?
                                      this.state.auxiliares.find(itemz => itemz._id === item.auxiliarId).nombre :
                                      null
                                  }</td>
                                  <td>{
                                    this.state.oficinas !== null && this.state.oficinas.find(itemz => itemz._id === item.oficinaId) !== undefined ?
                                      this.state.oficinas.find(itemz => itemz._id === item.oficinaId).nombre :
                                      null
                                  }</td>
                                  <td>{
                                    this.state.responsables !== null && this.state.responsables.find(itemz => itemz._id === item.usuarioId) !== undefined ?
                                      this.state.responsables.find(itemz => itemz._id === item.usuarioId).nombre :
                                      null
                                  }</td>
                                  {/*<td>{index.estadoActivo}</td>*/}
                                  <td>{item.costoInicial}</td>
                                  <td className={item.estado === 'activo' ? 'text-success' : 'text-danger'}>
                                    {item.estado} <i className={item.estado === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
                                  </td>
                                  <td>
                                    <Dropdown>
                                      <Dropdown.Toggle variant="success" id="dropdown-basic"></Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        {
                                          <Dropdown.Item
                                            href="#/action-2"
                                            onClick={evt => this.setModalInfo(evt, item)}
                                          >
                                            <span

                                              style={{
                                                fontSize: '14px',
                                              }}>+ Info</span>
                                          </Dropdown.Item>
                                        }
                                        {
                                          this.state.permissions !== undefined &&
                                          this.state.permissions.isEditable &&
                                          <>
                                            <Dropdown.Item
                                              href="#/action-2"
                                              onClick={evt => this.modifyActivo(evt, item)}
                                            >
                                              <span

                                                style={{
                                                  fontSize: '14px',
                                                }}>Modificar</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              href="#/action-2"
                                              onClick={evt => this.changeEstado(evt, item)}
                                            >
                                              <span

                                                style={{
                                                  fontSize: '14px',
                                                }}>Mod Estado</span>
                                            </Dropdown.Item>
                                          </>
                                        }
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                  <td>
                                    <Dropdown>
                                      <Dropdown.Toggle variant="info" id="dropdown-basic"></Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        {
                                          <Dropdown.Item
                                            href="#/action-2"
                                            onClick={evt => this.generateQR(evt, item)}
                                          >
                                            <span

                                              style={{
                                                fontSize: '14px',
                                              }}>QR</span>
                                          </Dropdown.Item>
                                        }
                                        <Dropdown.Item
                                          href="#/action-2"
                                          onClick={evt => this.setModalLogInfo(evt, item)}
                                        >
                                          <span

                                            style={{
                                              fontSize: '14px',
                                            }}>Logs</span>
                                        </Dropdown.Item>
                                        {
                                          this.state.permissions !== undefined &&
                                          this.state.permissions.isEditable &&
                                          (
                                            <Dropdown.Item
                                              href="#/action-2"
                                              onClick={evt => this.reevaluateActivo(evt, item)}
                                            >
                                              <span

                                                style={{
                                                  fontSize: '14px',
                                                }}>Reevaluar</span>
                                            </Dropdown.Item>
                                          )
                                        }
                                        <Dropdown.Item
                                          href="../detailActivo"
                                        >
                                          <span

                                            style={{
                                              fontSize: '14px',
                                            }}>Decifrar qr</span>
                                        </Dropdown.Item>
                                        {
                                          item.estado === 'inactivo' &&
                                          this.state.permissions !== undefined &&
                                          this.state.permissions.isEditable &&
                                          <>
                                            <Dropdown.Item href="#/action-3">
                                              <a>
                                                {
                                                  <PDFDownloadLink
                                                    document={
                                                      <ActivoBajaReport
                                                        data={item}
                                                      />}
                                                    fileName={`reporte-activo-baja`}
                                                    style={{
                                                      color: '#000',
                                                      backgroundColor: 'transparent'
                                                    }}
                                                  >
                                                    Reporte Baja
                                                  </PDFDownloadLink>}
                                              </a>
                                            </Dropdown.Item>
                                            {
                                              item.pdfPath && (
                                                <Dropdown.Item href="#/action-3">
                                                  <a
                                                    href={`${nodeimg}${item.pdfPath}`}
                                                    download
                                                    style={{
                                                      color: '#000',
                                                      backgroundColor: 'transparent',
                                                      fontSize: '14px'
                                                    }}
                                                    target="_blank"
                                                  >
                                                    Documento Respaldo
                                                  </a>
                                                </Dropdown.Item>
                                              )
                                            }
                                          </>
                                        }
                                      </Dropdown.Menu>
                                    </Dropdown>
                                    {/*{
                                        this.state.permissions !== undefined &&
                                        this.state.permissions.isDeletable &&
                                        (
                                          <a href="!#" onClick={evt => this.deleteActivo(evt, index)} className="badge badge-danger" style={{ marginRight: '3px' }}>Eliminar</a>
                                        )
                                      }*/}
                                  </td>
                                </tr>
                              )
                            }}
                          />

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
            </div>
            {/* showInactiveModal */}
            <Modal
              show={this.state.showRegisterModal}
              onHide={() => this.setShowRegisterModalClose()}
              centered
              size='lg'
            >
              {
                (this.state.changeToEdit || this.state.permissions.isAddble) &&
                (
                  <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title" id="card-title-activo">Registro y Asignacion de Activo</h4>
                          <form className="form-sample">
                            <p className="card-description"> Asignacion de Activo </p>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Codigo</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="text" id="inputCodigo" placeholder="Escoja Grupo y Auxiliar. El codigo se Generara autom." required onChange={this.handleCodigo} disabled />
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Fecha Incorporacion</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="date" id="inputFechaIncorporacion" required defaultValue={this.state.fechaIncorporacion} onChange={this.handleFechaIncorporacion} />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">UFV</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="text" placeholder="Seleccione Una Fecha de Incorporacion Valida" id="inputUfvId" required disabled />
                                    {/* <select className="form-control" required id="inputUfvId" onChange={this.handleUfvId}>
                                        <option hidden value=''>Escoga una Opcion</option>
                                        {
                                            this.state.ufvs !== null ? 
                                            this.state.ufvs.map((index, key) => (
                                                <option value={index._id} key={key}>{index.valor}</option>
                                            ))
                                            : <option>Cargando...</option>
                                        }
                                    </select> */}
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Fecha de Registro</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="date" id="inputFechaRegistro" onChange={this.handleFechaRegistro} required defaultValue={this.state.fechaIncorporacion} disabled />
                                    {/* <select className="form-control">
                                      <option>Male</option>
                                      <option>Female</option>
                                    </select> */}
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Grupo</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputGrupoId" onChange={this.handleGrupoId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.grupos !== null ?
                                          this.state.grupos.map((index, key) => (
                                            <option value={index._id} key={key}>{index.nombre}</option>
                                          ))
                                          : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Departamento</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputOficinaId" onChange={this.handleOficinaId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.oficinas !== null ?
                                          this.state.oficinas.map((index, key) => (
                                            <option value={index._id} key={key}>{index.nombre}</option>
                                          ))
                                          : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Auxiliar</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputAuxiliarId" onChange={this.handleAuxiliarId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.auxiliares !== null ?
                                          this.state.auxiliares
                                            .filter((index) => {
                                              if (this.state.grupoId === '') {
                                                return null
                                              } else {
                                                if (index.grupoId === this.state.grupoId) {
                                                  return index
                                                }
                                              }
                                              return null
                                            })
                                            .map((index, key) => (
                                              <option value={index._id} key={key}>{index.nombre}</option>
                                            ))
                                          : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Responsable</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputUsuarioId" onChange={this.handleUsuarioId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.responsables !== null ?
                                          this.state.responsables
                                            // .filter((index) => {
                                            // 	if(this.state.oficinaId === ''){
                                            // 		return null
                                            // 	}else{
                                            // 		if(index.oficinaId === this.state.oficinaId){
                                            // 			return index
                                            // 		}
                                            // 	}
                                            // 	return null
                                            // })
                                            .map((index, key) => (
                                              <option value={index._id} key={key}>{`${index.nombre} ${index.apPaterno} ${index.apMaterno}`}</option>
                                            ))
                                          : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Estado Activo</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputEstadoActivo" onChange={this.handleEstadoActivo}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      <option value='bueno'>Bueno</option>
                                      <option value='regular'>Regular</option>
                                      <option value='malo'>Malo</option>
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Cargo</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="text" placeholder="Seleccione un Responsable" id="inputCargo" required disabled />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <p className="card-description"> Datos de Activo </p>
                            <div className="row">
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Costo Inicial</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="number" placeholder="0.00 Bs." step="any" id="inputCostoInicial" required onChange={this.handleCostoInicial} />
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">VIDA</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="number" placeholder="En años" step="any" id="inputVida" required onChange={this.handleVida} disabled />
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">COE</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="number" placeholder="0% - 100%" step="1" min={1} max={100} id="inputCoe" required onChange={this.handleCoe} disabled />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Descripcion</label>
                                  <div className="col-sm-9">
                                    <textarea className="form-control" id="inputDescripcion" onChange={this.handleDescripcion} rows="5" placeholder="Descripcion Detallada del Activo Fijo&#10;Nombre, Codigo, Color, Etc." required></textarea>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Observaciones</label>
                                  <div className="col-sm-9">
                                    <textarea className="form-control" id="inputObservaciones" onChange={this.handleObservaciones} rows="5" placeholder="Observaciones de estado" required></textarea>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Imagen de Activo</label>
                                  <div className="col-sm-9">
                                    <input type="file" className="form-control" name="upload_file" onChange={this.handleImagePath} />
                                    <img src={this.state.image} style={{ maxHeight: 120, maxWidth: 120 }} id="imgContainer" alt="Esperando Imagen" />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                                <button className="btn btn-light" onClick={this.handleReset}>Borrar Datos</button>
                                {
                                  this.state.error !== '' ? <label style={{ color: 'red', fontSize: '0.875rem' }}>{this.state.error}</label> : null
                                }
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </Modal>
            <Modal
              show={this.state.showModifyModal}
              onHide={() => this.setShowModifyModalClose()}
              centered
              size='lg'
            >
              {
                (this.state.changeToEdit || this.state.permissions.isAddble) &&
                (
                  <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title" id="card-title-activo">Registro y Asignacion de Activo</h4>
                          <form className="form-sample">
                            <p className="card-description"> Asignacion de Activo </p>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Codigo</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="text" id="inputCodigo" placeholder="Escoja Grupo y Auxiliar. El codigo se Generara autom." required onChange={this.handleCodigo} disabled />
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Fecha Incorporacion</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="date" id="inputFechaIncorporacion" required defaultValue={this.state.fechaIncorporacion} onChange={this.handleFechaIncorporacion} />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">UFV</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="text" placeholder="Seleccione Una Fecha de Incorporacion Valida" id="inputUfvId" required disabled />
                                    {/* <select className="form-control" required id="inputUfvId" onChange={this.handleUfvId}>
                                        <option hidden value=''>Escoga una Opcion</option>
                                        {
                                            this.state.ufvs !== null ? 
                                            this.state.ufvs.map((index, key) => (
                                                <option value={index._id} key={key}>{index.valor}</option>
                                            ))
                                            : <option>Cargando...</option>
                                        }
                                    </select> */}
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Fecha de Registro</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="date" id="inputFechaRegistro" onChange={this.handleFechaRegistro} required defaultValue={this.state.fechaIncorporacion} disabled />
                                    {/* <select className="form-control">
                                      <option>Male</option>
                                      <option>Female</option>
                                    </select> */}
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Grupo</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputGrupoId" onChange={this.handleGrupoId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.grupos !== null ?
                                          this.state.grupos.map((index, key) => (
                                            <option value={index._id} key={key}>{index.nombre}</option>
                                          ))
                                          : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Departamento</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputOficinaId" onChange={this.handleOficinaId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.oficinas !== null ?
                                          this.state.oficinas.map((index, key) => (
                                            <option value={index._id} key={key}>{index.nombre}</option>
                                          ))
                                          : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Auxiliar</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputAuxiliarId" onChange={this.handleAuxiliarId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.auxiliares !== null ?
                                          this.state.auxiliares
                                            .filter((index) => {
                                              if (this.state.grupoId === '') {
                                                return null
                                              } else {
                                                if (index.grupoId === this.state.grupoId) {
                                                  return index
                                                }
                                              }
                                              return null
                                            })
                                            .map((index, key) => (
                                              <option value={index._id} key={key}>{index.nombre}</option>
                                            ))
                                          : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Responsable</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputUsuarioId" onChange={this.handleUsuarioId}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      {
                                        this.state.responsables !== null ?
                                          this.state.responsables
                                            // .filter((index) => {
                                            // 	if(this.state.oficinaId === ''){
                                            // 		return null
                                            // 	}else{
                                            // 		if(index.oficinaId === this.state.oficinaId){
                                            // 			return index
                                            // 		}
                                            // 	}
                                            // 	return null
                                            // })
                                            .map((index, key) => (
                                              <option value={index._id} key={key}>{`${index.nombre} ${index.apPaterno} ${index.apMaterno}`}</option>
                                            ))
                                          : <option>Cargando...</option>
                                      }
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Estado Activo</label>
                                  <div className="col-sm-9">
                                    <select className="form-control" required id="inputEstadoActivo" onChange={this.handleEstadoActivo}>
                                      <option hidden value=''>Escoga una Opcion</option>
                                      <option value='bueno'>Bueno</option>
                                      <option value='regular'>Regular</option>
                                      <option value='malo'>Malo</option>
                                    </select>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Cargo</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="text" placeholder="Seleccione un Responsable" id="inputCargo" required disabled />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <p className="card-description"> Datos de Activo </p>
                            <div className="row">
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Costo Inicial</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="number" placeholder="0.00 Bs." step="any" id="inputCostoInicial" required onChange={this.handleCostoInicial} />
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">VIDA</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="number" placeholder="En años" step="any" id="inputVida" required onChange={this.handleVida} disabled />
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-4">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">COE</label>
                                  <div className="col-sm-9">
                                    <Form.Control type="number" placeholder="0% - 100%" step="1" min={1} max={100} id="inputCoe" required onChange={this.handleCoe} disabled />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Descripcion</label>
                                  <div className="col-sm-9">
                                    <textarea className="form-control" id="inputDescripcion" onChange={this.handleDescripcion} rows="5" placeholder="Descripcion Detallada del Activo Fijo&#10;Nombre, Codigo, Color, Etc." required></textarea>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Observaciones</label>
                                  <div className="col-sm-9">
                                    <textarea className="form-control" id="inputObservaciones" onChange={this.handleObservaciones} rows="5" placeholder="Observaciones de estado" required></textarea>
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <Form.Group className="row">
                                  <label className="col-sm-3 col-form-label">Imagen de Activo</label>
                                  <div className="col-sm-9">
                                    <input type="file" className="form-control" name="upload_file" onChange={this.handleImagePath} />
                                    <img src={this.state.image} style={{ maxHeight: 120, maxWidth: 120 }} id="imgContainer" alt="Esperando Imagen" />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <button type="submit" className="btn btn-primary mr-2" onClick={evt => this.handleRegisterSubmit(evt, this.state)}>Enviar</button>
                                <button className="btn btn-light" onClick={this.handleReset}>Borrar Datos</button>
                                {
                                  this.state.error !== '' ? <label style={{ color: 'red', fontSize: '0.875rem' }}>{this.state.error}</label> : null
                                }
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </Modal>
            <Modal show={this.state.showInactiveModal} onHide={() => this.setModalDisableActivoClose()} centered>
              <DisableActivo
                data={this.state.inactiveModalData}
              />
            </Modal>
            <Modal show={this.state.showLogModal} onHide={() => this.setModalLogClose()} centered>
              <LogActivo
                data={this.state.modalActivo}
              />
            </Modal>
            <Modal show={this.state.show} onHide={() => this.setModalInfoClose()} centered>
              <Modal.Header closeButton>
                <Modal.Title>Info Activo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {
                  this.state.modalActivo !== null ?
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'row', border: '1px solid #ccc', fontSize: '12px' }}>
                        <div style={{ flex: 1, marginLeft: '10px', marginTop: '5px', marginBottom: '5px', borderRight: '6px solid #2196F3' }}>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%' }}>
                            <label style={{ flex: '0 0 30%', maxWidth: '40%', width: '100%', marginBottom: '2px' }}>Codigo:</label>
                            <label style={{ flex: '0 0 70%', maxWidth: '60%', width: '100%', marginBottom: '2px' }}>{this.state.modalActivo.codigo}</label>
                          </div>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%' }}>
                            <label style={{ flex: '0 0 30%', maxWidth: '40%', width: '100%', marginBottom: '2px' }}>Grupo: </label>
                            <label style={{ flex: '0 0 70%', maxWidth: '60%', width: '100%', marginBottom: '2px' }}>
                              {
                                this.state.grupos !== null && this.state.grupos.find(item => item._id === this.state.modalActivo.grupoId) !== undefined ?
                                  this.state.grupos.find(item => item._id === this.state.modalActivo.grupoId).nombre :
                                  null
                              }
                            </label>
                          </div>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%' }}>
                            <label style={{ flex: '0 0 30%', maxWidth: '40%', width: '100%', marginBottom: '2px' }}>Auxiliar: </label>
                            <label style={{ flex: '0 0 70%', maxWidth: '60%', width: '100%', marginBottom: '2px' }}>
                              {
                                this.state.auxiliares !== null && this.state.auxiliares.find(item => item._id === this.state.modalActivo.auxiliarId) !== undefined ?
                                  this.state.auxiliares.find(item => item._id === this.state.modalActivo.auxiliarId).nombre :
                                  null
                              }
                            </label>
                          </div>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%' }}>
                            <label style={{ flex: '0 0 30%', maxWidth: '40%', width: '100%', marginBottom: '2px' }}>Estado:</label>
                            <label style={{ flex: '0 0 70%', maxWidth: '60%', width: '100%', marginBottom: '2px' }}>{this.state.modalActivo.estadoActivo}</label>
                          </div>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%' }}>
                            <label style={{ flex: '0 0 30%', maxWidth: '40%', width: '100%', marginBottom: '2px' }}>Oficina: </label>
                            <label style={{ flex: '0 0 70%', maxWidth: '60%', width: '100%', marginBottom: '2px' }}>
                              {
                                this.state.oficinas !== null && this.state.oficinas.find(item => item._id === this.state.modalActivo.oficinaId) !== undefined ?
                                  this.state.oficinas.find(item => item._id === this.state.modalActivo.oficinaId).nombre :
                                  null
                              }
                            </label>
                          </div>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%' }}>
                            <label style={{ flex: '0 0 30%', maxWidth: '40%', width: '100%', marginBottom: '2px' }}>Responsable: </label>
                            <label style={{ flex: '0 0 70%', maxWidth: '60%', width: '100%', marginBottom: '2px' }}>
                              {
                                this.state.responsables !== null && this.state.responsables.find(item => item._id === this.state.modalActivo.usuarioId) !== undefined ?
                                  this.getResponsable(this.state.responsables.find(item => item._id === this.state.modalActivo.usuarioId)) :
                                  null
                              }
                            </label>
                          </div>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%' }}>
                            <label style={{ flex: '0 0 30%', maxWidth: '40%', width: '100%', marginBottom: '2px' }}>Costo:</label>
                            <label style={{ flex: '0 0 70%', maxWidth: '60%', width: '100%', marginBottom: '2px' }}>{this.state.modalActivo.costoInicial} Bs</label>
                          </div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', marginLeft: '10px', marginTop: '5px', marginBottom: '5px', alignSelf: 'center' }}>
                          <div style={{ maxWidth: '90%', width: '100%', textAlign: 'center', maxHeight: '100%' }}>
                            <img src={nodeimg + this.state.modalActivo.imagePath} alt="gaaa" style={{ maxWidth: '100%', maxHeight: '100%', height: '140px' }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', border: '1px solid #ccc' }}>
                        <div style={{ flex: 1, marginLeft: '10px', marginTop: '5px', marginBottom: '5px', borderBottom: '6px solid #2196F3' }}>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%', marginBottom: '4px' }}>
                            <p style={{ flex: '0 0 100%', maxWidth: '40%', width: '100%', marginBottom: '2px', fontSize: '12px' }}>Descripcion:</p>
                            <p style={{ flex: '0 0 100%', maxWidth: '60%', width: '100%', marginBottom: '2px', fontSize: '12px' }}>{this.state.modalActivo.descripcion}</p>
                          </div>
                        </div>
                        <div style={{ flex: 1, marginLeft: '10px', marginTop: '5px', marginBottom: '5px', borderBottom: '6px solid #2196F3' }}>
                          <div style={{ borderBottom: '2px solid #2196F3', maxWidth: '90%', width: '100%', marginBottom: '4px' }}>
                            <p style={{ flex: '0 0 100%', maxWidth: '40%', width: '100%', marginBottom: '2px', fontSize: '12px' }}>Observaciones:</p>
                            <p style={{ flex: '0 0 100%', maxWidth: '60%', width: '100%', marginBottom: '2px', fontSize: '12px' }}>{this.state.modalActivo.observaciones}</p>
                          </div>
                        </div>
                      </div>
                    </div> : null
                }
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => this.setModalInfoClose()}>
                  Cerrar
                </Button>
                {/* <Button variant="primary" onClick={() => this.setModalInfoClose()}>
                        Save Changes
                      </Button> */}
              </Modal.Footer>
            </Modal>
            <Modal
              show={this.state.showReevaluateModal}
              onHide={() => this.setShowReevaluateModalClose()}
              size='lg'
              centered
            >
              {
                this.state.isReevaluate ?
                  <div className="card">
                    <div className="card-body">
                      <a href="!#" onClick={evt => this.updateAcivo(evt, this.state.actualItemReevaluate)} className="badge badge-info" style={{ marginRight: '3px' }} >Actualizar</a>
                      <a href="!#" onClick={evt => this.deprecateActivo(evt, this.state.actualItemReevaluate)} className="badge badge-dark" style={{ marginRight: '3px' }}>Depreciar</a>
                      {
                        this.state.isDeprecate === true ?
                          <DeprecateActivo activo={this.state.activoDeprecate} /> :
                          null
                      }
                      <br />
                      {
                        this.state.isUpdate === true ?
                          <UpdateActivo activo={this.state.activoUpdate} /> : null
                      }
                    </div>
                  </div> : null
              }
            </Modal>
            <Modal
              show={this.state.showQrModal}
              onHide={() => this.setShowQrModalClose()}
              size='sm'
              centered
            >
              {
                this.state.qrCode !== '' ?
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title">QR Del Activo</h4>
                      <QRCode value={this.state.qrCode} id={this.state.qrCode} />
                      <PDFDownloadLink document={<QrReport qr={this.state.qrCode} info={this.state.qrSelectedInfo} />} fileName={`reporte-qr-activo`} className="badge badge-dark" style={{ marginRight: '3px' }}>
                        QR
                        {/* {({ blob, url, loading, error }) =>
                            loading ? 'Cargando...' : 'Reporte Actualizacion'
                          } */}
                      </PDFDownloadLink>
                    </div>
                  </div>
                  : null
              }
            </Modal>
          </div>
        )
      }
    }
  }
}

export default Personal
