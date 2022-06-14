import React, { useState } from 'react';

import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import CryptoJS from 'crypto-js';
import { passphrase } from '../../views/Passphrase';

export default function ActivoDetail() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false)


  const onSubmit = (dataFromForm) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(dataFromForm['dataEncoded'], passphrase);
      const plainText = decrypted.toString(CryptoJS.enc.Utf8);
      setData(JSON.parse(plainText));
      setError(false);
    } catch (error) {
      setError(true);
      setData(null);
    }
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title" id="card-title-user">QR Detalle De Activo</h4>
              <form className="form-sample" onSubmit={handleSubmit(onSubmit)}>
                <p className="card-description">Ver Detalle De Activo QR</p>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Codigo de Activo   </label>
                      <div className="col-sm-9">
                        <Form.Control
                          type="text"
                          placeholder="Introduzca el codigo escaneado"
                          id="inputCargoName"
                          required
                          {...register(`dataEncoded`)}
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12'>
                    <button type="submit" className="btn btn-primary mr-2">Ver Datos</button>
                    <button type='reset' className="btn btn-light">Borrar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {
        data !== null ?
          (
            <div className="row">
              <div className='col-md-12 grid-margin stretch-card'>
                <div className='card'>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label className='col-sm-6 col-form-label'>Codigo Activo: </label>
                      <label className="col-sm-6">{data.codigo}</label>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label className='col-sm-6 col-form-label'>Activo: </label>
                      <label className="col-sm-6">{data.activo}</label>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label className='col-sm-6 col-form-label'>Descripcion: </label>
                      <label className="col-sm-6">{data.descripcion}</label>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label className='col-sm-6 col-form-label'>Responsable: </label>
                      <label className="col-sm-6">{data.responsable}</label>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label className='col-sm-6 col-form-label'>Estado: </label>
                      <label className="col-sm-6">{data.estado}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          : null
      }
      {
        error ?
          <div className="row">
            <div className='col-md-12 grid-margin stretch-card'>
              <div className='card'>
                <div className='row'>
                  <div className='col-md-12'>
                    <label className="col-sm-6">Error Codigo no Valido</label>
                  </div>
                </div>
              </div>
            </div>
          </div> : null
      }
    </>
  )
};
