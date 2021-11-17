import React, {Component} from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import logo from './logo.jpeg'

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

class ActivoReport extends Component {
    constructor(props) {
        super(props)
        this.state ={
            date: null,
            data: null,
            oficinas: null,
            auxiliares: null,
        }
    }

    componentDidMount(){
        this.getData()
        this.getOficinas()
        this.getAuxiliares()
    }

    getData(){
        var now = new Date();
        now.setMinutes(now.getDate());
        var date = now.toISOString().slice(0,10);
        this.setState({date: date})

        const response = async () => {
        await axios.get(nodeapi+'activos')
        .then(res => this.setState({data: res.data}))
        .catch(err => console.log(err))
        }
        response()
    }

    getOficinas(){
        const response = async () => {
        await axios.get(nodeapi+'oficinas')
        .then(res => this.setState({oficinas: res.data}))
        .catch(err => console.log(err))
        }
        response()
    }

    getAuxiliares() {
        const response = async () => {
        await axios.get(nodeapi+'auxiliares')
        .then(res => this.setState({auxiliares: res.data}))
        .catch(err => console.log(err))
        }
        response()
    }

    getUser(id) {
        const data = this.state.users.find(item => item._id === id)
        if(data !== undefined) {
            return `${data.nombre} ${data.apPaterno} ${data.apMaterno}`
        } 
        return '' 
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
        return(
            <Document>
                <Page size="LETTER" style={styles.page}>
                    <View style={styles.logoContainer}>
                        <Image
                        style={{maxHeight: 40, maxWidth: 70}}
                        src={logo}
                        />
                    </View>
                    <View style={styles.invoiceInfoContainer}>
                        <View style={{flex: 1}}>
                            <Text style={{marginBottom: 20,fontSize: 18}}>
                            Reporte
                            </Text>
                            <Text>
                            Fecha De Reporte: {this.state.date}
                            </Text>
                        </View>
                        <View style={{flex: 1, textAlign: 'right'}}>
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
                        <Text style={{textAlign: 'center'}}>REPORTE ESTADO DE ACTIVOS</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={[styles.rowChildren, {flex: 1,}]}>N°</Text>
                            <Text style={[styles.rowChildren, {flex: 2,}]}>Codigo</Text>
                            <Text style={[styles.rowChildren, {flex: 2,}]}>Auxiliar</Text>
                            <Text style={[styles.rowChildren, {flex: 2,}]}>Costo Inicial</Text>
                            <Text style={[styles.rowChildren, {flex: 2,}]}>Estado</Text>
                        </View>
                        {
                            this.state.data !== null && this.state.oficinas !== null && this.state.auxiliares !== null ?
                            this.state.data
                            .filter(res => {
                                if(res.estado === "activo")
                                {
                                    return res;
                                }
                                return null;
                            })
                            .map((index,key) => (
                                <View style={styles.row} key={key}>
                                    <Text style={[styles.rowChildren, {flex: 1}]}>{key + 1}</Text>
                                    <Text style={[styles.rowChildren, {flex: 2}]}>{index.codigo}</Text>
                                    <Text style={[styles.rowChildren, {flex: 2}]}>
                                    {this.state.auxiliares !== null && this.state.auxiliares.find(item => item._id === index.auxiliarId) !== undefined ? 
                                    this.state.auxiliares.find(item => item._id === index.auxiliarId).nombre :
                                    null}
                                    </Text>
                                    <Text style={[styles.rowChildren, {flex: 2}]}>{index.costoInicial}</Text>
                                    <Text style={[styles.rowChildren, {flex: 2}]}>{index.estado.toUpperCase()}</Text>
                                </View>
                            ))
                            : null
                        }
                    </View>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            </Document>
        )
    }
}

export default ActivoReport