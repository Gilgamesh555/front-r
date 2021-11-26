import React, {Component} from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import logo from './logo.jpeg'

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

class DepreciacionReport extends Component {
    constructor(props) {
        super(props)
        this.state ={
            date: null,
            data: null,
            oficinas: null,
            auxiliares: null,
            resultValue: 0,
        }

        this.getValue = this.getValue.bind(this);
    }

    componentDidMount(){
        this.getData()
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

    getAuxiliares() {
        const response = async () => {
        await axios.get(nodeapi+'auxiliares')
        .then(res => this.setState({auxiliares: res.data}))
        .catch(err => console.log(err))
        }
        response()
    }

    getValue(value)
    {
        this.setState({resultValue: this.state.resultValue + value});
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
                        <Text style={{textAlign: 'center'}}>DEPRECIACION DE ACTIVOS - GRUPO {this.props.data.nombre.toUpperCase()}</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={[styles.rowChildren, {flex: 1,}]}>N°</Text>
                            <Text style={[styles.rowChildren, {flex: 2,}]}>Codigo</Text>
                            <Text style={[styles.rowChildren, {flex: 2,}]}>Auxiliar</Text>
                            <Text style={[styles.rowChildren, {flex: 2,}]}>Costo Inicial</Text>
                            <Text style={[styles.rowChildren, {flex: 2,}]}>Valor Depreciacion</Text>
                        </View>
                        {
                            this.state.data !== null && this.state.auxiliares !== null ?
                            this.state.data
                            .filter((index) => {
                                if(index.grupoId === this.props.data._id){
                                    return index
                                }
                                return null
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
                                    <DeprecateValue data={index} onGetValue={this.getValue}/>
                                </View>
                            ))
                            : null
                        }
                        <View style={styles.row}>
                            <Text style={[styles.rowChildren, {flex: 1}]}></Text>
                            <Text style={[styles.rowChildren, {flex: 2}]}></Text>
                            <Text style={[styles.rowChildren, {flex: 2}]}></Text>
                            <Text style={[styles.rowChildren, {flex: 2}]}>Total</Text>
                            <Text style={[styles.rowChildren, {flex: 2, color: 'red'}]}>
                            {this.state.resultValue.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            </Document>
        )
    }
}

class DeprecateValue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
        }
    }

    componentDidMount() {
        this.deprecateValor(this.props.data)
    }

    deprecateValor(activo) {
        var valor = activo.costoInicial
        valor = parseFloat(valor)
        const data = {
          _id: activo.grupoId
        }
        const response = async () => {
        await axios.get(nodeapi+`grupos/${data._id}`)
        .then(res => {
        var coe = parseInt(res.data.coe)
        coe = coe / 100
        valor = valor * coe
        this.props.onGetValue(valor)
        this.setState({value: valor})
        })
        .catch(err => console.log(err))
        }
        response()
    }

    render() {
        const styles = StyleSheet.create({
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
            <Text style={[styles.rowChildren, {flex: 2, color: 'red'}]}>
            {this.state.value !== null ? this.state.value: null}
            </Text>
        )
    }
}

export default DepreciacionReport