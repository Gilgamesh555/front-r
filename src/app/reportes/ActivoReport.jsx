import React, { Component } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import logo from './logo.jpeg'

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

class ActivoReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: null,
      data: null,
      oficinas: null,
      auxiliares: null,
      responsible: null,
    }
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
    this.getData()
    this.getOficinas()
    this.getAuxiliares()
    const user = this.decodeToken(this.props.token);
    this.getUser(user.id)
  }

  getData() {
    var now = new Date();
    now.setMinutes(now.getDate());
    var date = now.toISOString().slice(0, 10);
    this.setState({ date: date })

    const response = async () => {
      await axios.get(nodeapi + 'activos')
        .then(res => this.setState({ data: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  getOficinas() {
    const response = async () => {
      await axios.get(nodeapi + 'oficinas')
        .then(res => this.setState({ oficinas: res.data }))
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

  getUser(id) {
    const response = async () => {
      await axios.get(nodeapi + `users/${id}`)
        .then(res => this.setState({ responsible: res.data }))
        .catch(err => console.log(err))
    }
    response()
  }

  render() {
    Font.register({
      family: 'Oswald',
      src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
    });
    const styles = StyleSheet.create({
      page: {
        fontSize: 10,
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontFamily: 'Oswald',
        backgroundColor: '#E4E4E4'
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
      },
      logoContainer: {
        marginTop: 20,
        marginRight: 0,
        marginBottom: 30,
        marginLeft: 0,
      },
      invoiceInfoContainer: {
        flexDirection: 'row',
        fontSize: 12,
        borderBottom: 1,
      },
      titleContainer: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 13,
      },
      table: {
        fontSize: 10,
      },
      row: {
        flexDirection: 'row',
      },
      rowChildren: {
        flex: 3,
        borderTop: 1,
      },
      pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
      },
    })
    return (
      <Document>
        <Page size="LETTER" style={styles.page}>
          <View style={styles.logoContainer}>
            <Image
              style={{ maxHeight: 40, maxWidth: 70 }}
              src={logo}
            />
          </View>
          <View style={styles.invoiceInfoContainer}>
            <View style={{ flex: 1 }}>
              <Text style={{ marginBottom: 20, fontSize: 18 }}>
                Reporte
              </Text>
              <Text>
                Fecha De Entrega: {this.state.date}
              </Text>
            </View>
            <View style={{ flex: 1, textAlign: 'right' }}>
              <Text>
                Empresa MINERA KERUMIN S.R.L.
              </Text>
              <Text>
                Calle Durán de Castro #189
              </Text>
              <Text>
                Potosi - Bolivia
              </Text>
              <Text>
                minerakerumin@gmail.com
              </Text>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={{ textAlign: 'center' }}>ENTREGA DE ACTIVOS</Text>
            {/*<Text style={{ textAlign: 'center' }}>{`${this.props.data.nombre} ${this.props.data.apPaterno} ${this.props.data.apMaterno}`}</Text>*/}
          </View>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.rowChildren, { flex: 1, }]}>N°</Text>
              <Text style={[styles.rowChildren, { flex: 2, }]}>Codigo</Text>
              <Text style={[styles.rowChildren, { flex: 2, }]}>Auxiliar</Text>
              <Text style={[styles.rowChildren, { flex: 2, }]}>Costo Inicial</Text>
              <Text style={[styles.rowChildren, { flex: 2, }]}>Estado</Text>
              <Text style={[styles.rowChildren, { flex: 2, }]}>Oficina</Text>
              {/*<Text style={[styles.rowChildren, {flex: 2,}]}>Oficina</Text> */}
            </View>
            {
              this.state.data !== null && this.state.oficinas !== null && this.state.auxiliares !== null ?
                this.state.data.filter(index => {
                  if (index.usuarioId === this.props.data._id) {
                    return index
                  }
                  return null
                })
                  .map((index, key) => (
                    <View style={styles.row} key={key}>
                      <Text style={[styles.rowChildren, { flex: 1 }]}>{key + 1}</Text>
                      <Text style={[styles.rowChildren, { flex: 2 }]}>{index.codigo}</Text>
                      <Text style={[styles.rowChildren, { flex: 2 }]}>
                        {this.state.auxiliares !== null && this.state.auxiliares.find(item => item._id === index.auxiliarId) !== undefined ?
                          this.state.auxiliares.find(item => item._id === index.auxiliarId).nombre :
                          null}
                      </Text>
                      <Text style={[styles.rowChildren, { flex: 2 }]}>{index.costoInicial}</Text>
                      <Text style={[styles.rowChildren, { flex: 2 }]}>{index.estadoActivo}</Text>
                      <Text style={[styles.rowChildren, { flex: 2 }]}   >
                        {this.state.oficinas !== null && this.state.oficinas.find(item => item._id === index.oficinaId) !== undefined ?
                          this.state.oficinas.find(item => item._id === index.oficinaId).nombre :
                          null}
                      </Text>
                      {/*<Text style={[styles.rowChildren, {flex: 2}]}>{}</Text>*/}
                    </View>
                  ))
                : null
            }
          </View>
          {
            this.state.responsible !== null ? (
              <View style={styles.row}>
                <View style={[styles.rowChildren, { flex: 2 }]}>
                  <Text style={{ textAlign: 'center' }}> {'\n'} {'\n'} {'\n'}_____________________________________</Text>
                  <Text style={{ textAlign: 'center' }}>{`${this.props.data.nombre} ${this.props.data.apPaterno} ${this.props.data.apMaterno}`}</Text>
                  <Text style={{ textAlign: 'center' }}>{`${this.props.data.cargo} - Recibe`}</Text>
                </View>
                <View style={[styles.rowChildren, { flex: 2 }]}>
                  <Text style={{ textAlign: 'center' }}> {'\n'} {'\n'} {'\n'}_____________________________________</Text>
                  <Text style={{ textAlign: 'center' }}>{`${this.state.responsible.nombre} ${this.state.responsible.apPaterno} ${this.state.responsible.apMaterno}`}</Text>
                  <Text style={{ textAlign: 'center' }}>{`${this.state.responsible.cargo} - Entrega`}</Text>
                </View>
              </View>
            ) : null
          }
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} fixed />
        </Page>
      </Document>
    )
  }
}

export default ActivoReport