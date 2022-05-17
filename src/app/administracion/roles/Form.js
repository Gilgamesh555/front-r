import React, { useEffect, useState } from 'react';

import axios from 'axios';
import nodeapi from '../../../apis/nodeapi';

import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { listenBySelector } from '@fullcalendar/core';

function FormRole({ data }) {
  const { register, handleSubmit } = useForm();
  const [views, setViews] = useState(null);

  const values = {
    title: 'Editar Rol',
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
    values.title = 'Añadir Rol';
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
      onRegisterRole(dataFromForm);
    } else {
      onSubmitUpdate(dataFromForm);
    }
  }

  const onRegisterRole = async (dataFromForm) => {
    const createRole = async (data) => {
      return await axios.post(`${nodeapi}roles`, data);
    }
    const createRoleView = async (data) => {
      await axios.post(`${nodeapi}roleviews`, data);
    }

    let role ={
      name: dataFromForm['roleName'],
    }

    const newRol = await createRole(role);
    console.log(newRol);
    views.map(async (item) => {
      const newRoleView = {
        roleId: newRol.data.role._id,
        viewId: item._id,
        isVisible: dataFromForm[`isVisible-${item._id}`],
        isEditable: dataFromForm[`isEditable-${item._id}`],
        isDeletable: dataFromForm[`isDeletable-${item._id}`],
        isAddble: dataFromForm[`isAddble-${item._id}`],
      }

      await createRoleView(newRoleView);
    })
  }

  const onSubmitUpdate = async (dataFromForm) => {
    const updatePermissions = async(data, permissions) => {
      await axios.put(`${nodeapi}roleviews/${data._id}`, permissions);
    }

    const updateRole = async (role) => {
      await axios.put(`${nodeapi}roles/${data._id}`, role);
      console.log('aa');
    }

    let role ={
      name: dataFromForm['roleName'],
    }

    if (dataFromForm['roleName'] === '') {
        role.name = data.name;
    }

    await updateRole(role);

    views.map(async (item) => {
      const permissions = {
        isVisible: dataFromForm[`isVisible-${item._id}`],
        isEditable: dataFromForm[`isEditable-${item._id}`],
        isDeletable: dataFromForm[`isDeletable-${item._id}`],
        isAddble: dataFromForm[`isAddble-${item._id}`],
      }
      await updatePermissions(item, permissions);
    })

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
                    <label className="col-sm-3 col-form-label">Nombre Rol</label>
                    <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        placeholder="Nombre de Rol" 
                        id="inputRolName" 
                        required 
                        {...register(`roleName`)}
                        defaultValue={
                          data !== null ? data.name : ''
                        }  
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className='row'>
                <div className="col-lg-12 grid-margin stretch-card">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Vista</th>
                        <th>Ver</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                        <th>Añadir</th>
                      </tr>
                    </thead>
                    <tbody className='table-body-notFound'>
                      {
                        views !== null &&
                        views.map((item) => (
                          <tr key={item._id}>
                            <td>
                              {
                                data === null ? item.name : item.viewName
                              }
                            </td>
                            <td>
                              <label className="form-check-label">
                                <input type="checkbox"
                                  defaultChecked={item.isVisible}
                                  {...register(`isVisible-${item._id}`)}
                                />
                                <i className="input-helper"></i>
                              </label>
                            </td>
                            <td>
                              <label className="form-check-label">
                                <input type="checkbox"
                                  defaultChecked={item.isEditable}
                                  {...register(`isEditable-${item._id}`)}
                                />
                                <i className="input-helper"></i>
                              </label>
                            </td>
                            <td>
                              <label className="form-check-label">
                                <input type="checkbox"
                                  defaultChecked={item.isDeletable}
                                  {...register(`isDeletable-${item._id}`)}
                                />
                                <i className="input-helper"></i>
                              </label>
                            </td>
                            <td>
                              <label className="form-check-label">
                                <input type="checkbox"
                                  defaultChecked={item.isAddble}
                                  {...register(`isAddble-${item._id}`)}
                                />
                                <i className="input-helper"></i>
                              </label>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  {/* <div className="form-check">
                        <label className="form-check-label">
                          <input type="checkbox" defaultChecked className="form-check-input" />
                          <i className="input-helper"></i>
                          Checked
                        </label>
                      </div>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input type="checkbox" disabled className="form-check-input" />
                          <i className="input-helper"></i>
                          Disabled
                        </label>
                      </div> */}
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12'>
                  <button type="submit" className="btn btn-primary mr-2">Enviar</button>
                  <button type='reset' className="btn btn-light">Borrar Datos</button>
                  {/* {
                    this.state.error !== '' ? <label style={{ color: 'red', fontSize: '0.875rem' }}>{this.state.error}</label> : null
                  } */}
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