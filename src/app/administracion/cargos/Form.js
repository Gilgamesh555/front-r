import React, { useEffect, useState } from 'react';

import axios from 'axios';
import nodeapi from '../../../apis/nodeapi';

import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function FormRole({ data }) {
  const { register, handleSubmit } = useForm();
  const [views, setViews] = useState(null);

  const values = {
    title: 'Editar Cargo',
  };

  useEffect(() => {
    if (data !== null) {
      response();
      return;
    } else {
      responseAdd();
    }
  }, [data])

  if (data === null) {
    values.title = 'Añadir Cargo';
  }

  const response = async () => {
    await axios.get(`${nodeapi}roles/getWithNameViews`, {
      params: {
        roleId: data._id
      }
    })
      .then(res => {
        if (res.status === 200) {
          setViews(res.data);
        }
      })
      .catch(err => console.log(err))
  }

  const responseAdd = async () => {
    await axios.get(`${nodeapi}views`)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          setViews(res.data);
        }
      })
      .catch(err => console.log(err))
  }

  const onSubmit = (dataFromForm) => {
    if (data === null) {
      onRegisterCargo(dataFromForm);
    } else {
      onSubmitCargo(dataFromForm);
    }
  }

  const onRegisterCargo = async (dataFromForm) => {
    const createCargo = async (data) => {
      return await axios.post(`${nodeapi}cargos`, data);
    }

    let cargo ={
      name: dataFromForm['cargoName'],
    }

    await createCargo(cargo);

    window.location.reload();
  }

  const onSubmitCargo = async (dataFromForm) => {
    const updateCargo = async (cargo) => {
      await axios.put(`${nodeapi}cargos/${data._id}`, cargo);
    }

    let cargo ={
      name: dataFromForm['cargoName'],
    }

    if (dataFromForm['roleName'] === '') {
        cargo.name = data.name;
    }

    await updateCargo(cargo);

    window.location.reload();
  }

  return (
    <div className="row">
      <div className="col-md-9 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title" id="card-title-user">{values.title}</h4>
            <form className="form-sample" onSubmit={handleSubmit(onSubmit)}>
              <p className="card-description">{values.title}</p>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="row">
                    <label className="col-sm-3 col-form-label">Nombre Cargo</label>
                    <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        placeholder="Nombre de Cargo" 
                        id="inputCargoName" 
                        required 
                        {...register(`cargoName`)}
                        defaultValue={
                          data !== null ? data.name : ''
                        }  
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12'>
                  <button type="submit" className="btn btn-primary mr-2">Enviar</button>
                  <button type='reset' className="btn btn-light">Borrar Datos</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormRole;