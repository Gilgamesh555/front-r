import { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logo from '../../reportes/logo.jpeg';
import axios from 'axios';
import api from '../../../apis/nodeapi';

export default function ActivesByDepartmentReport({ data }) {
  const { _id, nombre } = data;
  const [actives, setActives] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    getDate();
    getActives();
  }, [])

  const getDate = () => {
    var now = new Date();
    now.setMinutes(now.getDate());
    var date = now.toISOString().slice(0, 10);
    setDate(date);
  }

  const getActives = async () => {
    const res = await axios.get(`${api}activos/oficina/${_id}`);
    try {
      const { data } = res;
      let newActives = data.map(async item => {
        item.auxiliar = await getAuxiliarByActivoId(item.auxiliarId);
        item.responsable = await getResponsableByActivoId(item.usuarioId);

        return item;
      })
      newActives = await Promise.all(newActives)
      setActives(newActives);
    } catch (error) {
    }
  }

  const getAuxiliarByActivoId = async (id) => {
    const res = await axios.get(`${api}auxiliares/${id}`);
    try {
      const { data } = res;
      const { nombre } = data;
      return nombre;
    } catch (error) {

    }
    return ''
  }

  const getResponsableByActivoId = async (id) => {
    const res = await axios.get(`${api}users/${id}`);
    try {
      const { data } = res;
      const name = `${data.nombre} ${data.apPaterno} ${data.apMaterno}`;
      return name;
    } catch (error) {

    }
    return ''
  }

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
              Fecha De Reporte: {date}
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
          <Text style={{ textAlign: 'center' }}>REPORTE DEPARTAMENTO {nombre.toUpperCase()} - ACTIVOS</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.rowChildren, { flex: 1, }]}>N°</Text>
            <Text style={[styles.rowChildren, { flex: 2, }]}>Codigo</Text>
            <Text style={[styles.rowChildren, { flex: 2, }]}>Auxiliar</Text>
            <Text style={[styles.rowChildren, { flex: 2, }]}>Costo Inicial</Text>
            <Text style={[styles.rowChildren, { flex: 2, }]}>Estado</Text>
            <Text style={styles.rowChildren}>Responsable</Text>
          </View>
          {
            actives && (
              actives.map((item, key) => (
                <View style={styles.row} key={key}>
                  <Text style={[styles.rowChildren, { flex: 1 }]}>{key + 1}</Text>
                  <Text style={[styles.rowChildren, { flex: 2 }]}>{item.codigo}</Text>
                  <Text style={[styles.rowChildren, { flex: 2 }]}>{item.auxiliar}</Text>
                  <Text style={[styles.rowChildren, { flex: 2 }]}>{item.costoInicial}</Text>
                  <Text style={[styles.rowChildren, { flex: 2 }]}>{item.estadoActivo}</Text>
                  <Text style={styles.rowChildren}>{item.responsable}</Text>
                </View>
              ))
            )
          }
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}