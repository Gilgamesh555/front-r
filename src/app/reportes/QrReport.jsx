import React, {Component} from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import logo from './logo.jpeg'

import axios from 'axios'
import nodeapi from '../../apis/nodeapi'

class GrupoReport extends Component {
    constructor(props) {
        super(props)
        this.state ={
            date: null,
            data: null,
            oficinas: null,
            users: null,
            auxiliares: null,
            qrCode: null,
        }
    }

    componentDidMount(){
        this.getData()
        // var s = new XMLSerializer().serializeToString(document.getElementById(this.props.qr))
        // var encodedData = window.btoa(s);
        // var imgSource = `data:image/svg+xml;base64,${encodedData}`
        // this.setState({qrCode: imgSource})
    }

    getQrCode() {
        var s = document.getElementById(this.props.qr).toDataURL()
        return s
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
                            QR DE ACTIVO
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
                        <Text style={{textAlign: 'center'}}>QR ACTIVO</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Image
                            src={this.getQrCode()} 
                            style={{display: 'block', margin: 'auto', width: 120, height: 120}}
                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={{display: 'block', margin: 'auto', fontSize: 13}}>{this.props.info.codigo}</Text>
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

export default GrupoReport