import { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import logo from './logo.jpeg'

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'
import nodeimg from '../../apis/nodeimg'

export default function ActivoBajaReport({ data }) {
  const [report, setReport] = useState(null);
  const [userName, setUserName] = useState(null);
  const [auxiliarName, setAuxiliarName] = useState(null);

  useEffect(() => {
    const getReport = async () => {
      const baja = await axios.get(`${nodeapi}activoBaja/byActivoId/${data._id}`);
      setReport(baja.data);
    }

    const getAuxiliarName = async () => {
      const res = await axios.get(`${nodeapi}auxiliares/${data.auxiliarId}`);
      setAuxiliarName(res.data.nombre)
    }

    getReport();
    getAuxiliarName();
  }, [])

  useEffect(() => {
    const getUserName = async () => {
      const res = await axios.get(`${nodeapi}users/${report.userId}`);
      const user = res.data;
      const userName = `${user.nombre} ${user.apPaterno} ${user.apMaterno}`;
      setUserName(userName);
    }
    if(report !== null) {
      getUserName();
    }
  }, [report])

  const styles = {
    page: {
      fontSize: 10,
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
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
      borderTop: 2,
      borderBottom: 2,
      borderColor: '#006277',
      color: '#006277',
      fontWeight: '900'
    },
    table: {
      fontSize: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between'
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
    info: {
      data: {
        flex: 2,
        padding: '0 20'
      },
      image: {
        flex: 2,
        padding: '0 20'
      },
      title: {
        flexBasis: '40%',
      },
      simpleBody: {
        flexBasis: '60%',
        textAlign: 'right',
      },
      body: {
        textAlign: 'right',
        flexBasis: '60%',
      },
      flexDirection: 'row',
    },
    stats: {
      item: {
        flex: 1,
        padding: 3
      },
    },
    summary: {
      titleRow: {
        color: '#006277',
        fontWeight: '900',
        borderBottom: 2,
        borderColor: '#006277',
      },
      item: {
        borderBottom: 1,
        borderColor: '#006277',
        padding: 3,
      },
      column: {
        flex: 1
      }
    },
    title: {
      color: '#006277',
      fontWeight: '900'
    },
    rowItem: {
      paddingBottom: '15'
    },
  }

  // Font.register({
  //   family: 'Lato',
  //   src: 'https://fonts.googleapis.com/css2?family=Gentium+Plus&display=swap'
  // });

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
              {/* Fecha De Reporte: {this.state.date} */}
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
          <Text style={{ textAlign: 'center' }}>REPORTE ACTIVO ESTADO DE BAJA</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.info.data}>
            <View style={[styles.row, styles.rowItem]}>
              <View style={styles.info.title}>
                <Text style={styles.title}>Nombre Activo: </Text>
              </View>
              {
                auxiliarName !== null ?
                  <View style={styles.info.body}>
                    <Text>{auxiliarName}</Text>
                  </View> : null
              }
            </View>
            <View style={[styles.row, styles.rowItem]}>
              <View style={styles.info.title}>
                <Text style={styles.title}>Fecha: </Text>
              </View>
              {
                report !== null ?
                  <View style={styles.info.body}>
                    <Text>{report.date}</Text>
                  </View> : null
              }
            </View>
            <View style={[styles.row, styles.rowItem]}>
              <View style={styles.info.title}>
                <Text style={styles.title}>Usuario Responsable de Baja: </Text>
              </View>
              {
                userName !== null ?
                  <View style={styles.info.body}>
                    <Text>{userName}</Text>
                  </View> : null
              }
            </View>
            <View style={[styles.row, styles.rowItem]}>
              <View style={styles.info.title}>
                <Text style={styles.title}>Descripcion: </Text>
              </View>
              {
                report !== null ?
                  <View style={styles.info.body}>
                    <Text>{report.description}</Text>
                  </View> : null
              }
            </View>
          </View>
          <View style={styles.info.image}>
            <View>
              {
                report !== null ?
                  <Image
                    src={`${nodeimg}${report.imagePath}`}
                    style={{ minHeight: '130', maxHeight: '100%', height: '180' }}
                  /> : null
              }
            </View>
          </View>
        </View>
        {/* <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed /> */}
      </Page>
    </Document>
  );
}