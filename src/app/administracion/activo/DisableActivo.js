import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import nodeapi from '../../../apis/nodeapi';

import axios from 'axios';

export default function DisableActivo({ data }) {
  const { register, handleSubmit } = useForm();
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [pdfPath, setPdfPath] = useState(null);

  const onSaveReport = async (dataFromForm) => {
    const response = async () => {
      await axios.put(nodeapi + `activos/${data._id}/estado`, data)
        .then(res => res)
        .catch(err => console.log(err))
    }

    const saveReport = async () => {
      const activoBaja = {
        userId: data.usuarioId,
        activoId: data._id,
        description: dataFromForm['description'],
        date: new Date(),
        imagePath: imagePath,
        pdfPath: pdfPath,
      }

      var form_data = new FormData()

      for (var key in activoBaja) {
        form_data.append(key, activoBaja[key])
      }

      await axios.post(nodeapi + `activoBaja`, form_data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }

    await response();
    await saveReport();

    window.location.reload();
  }

  const handleImagePath = (event) => {
    setImagePath(event.target.files[0]);
    var file = event.target.files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = function (e) {
      setImage([reader.result])
    }
  }

  const handlePdfPath = (event) => {
    setPdfPath(event.target.files[0]);
    var file = event.target.files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Bitacora De Activo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Dar De Baja Activo</h4>
              <form className="form-sample" onSubmit={handleSubmit(onSaveReport)}>
                <p className="card-description"> Formulario </p>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Descripcion</label>
                      <div className="col-sm-9">
                        <Form.Control
                          type="text"
                          id="inputFechaIncorporacion"
                          required
                          placeholder='Descripcion'
                          {...register(`description`)}
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Imagen de Activo</label>
                      <div className="col-sm-9">
                        <input
                          type="file"
                          className="form-control"
                          name="upload_file"
                          onChange={handleImagePath}
                          accept="image/*"
                        />
                        <img
                          src={image}
                          style={{ maxHeight: 120, maxWidth: 120 }}
                          id="imgContainer"
                          alt="Esperando Imagen"
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Documento de Respaldo</label>
                        <div className="col-sm-9">
                          <input
                            type="file"
                            className="form-control"
                            name="upload_file"
                            onChange={handlePdfPath}
                            accept="application/pdf"
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <button type="submit" className="btn btn-primary mr-2">Obtener Actualizacion</button>
                  <button className="btn btn-light" type='reset'>Borrar Datos</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </>
  )
}