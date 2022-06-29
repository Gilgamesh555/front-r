import React, { useEffect, useState } from 'react';

import axios from 'axios'
import nodeapi from '../../../apis/nodeapi'

import ItemCargo from './Item';
import FormCargo from './Form';
import { useForm } from 'react-hook-form';
import { Views } from '../../../views/Views';
import { Modal } from 'react-bootstrap';
import { ItemPagination } from '../ItemPagination';

export default function CargoView({ history }) {
  const { register, getValues } = useForm();
  const ViewName = 'Cargos';
  const viewId = Views.cargos;
  const [cargos, setCargos] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isAuth, setIsAuth] = useState(true);
  const [permissions, setPermissions] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    response();
  }, []);

  useEffect(() => {
    const checkToken = () => {
      const token = window.localStorage.getItem('token')
      if (token) {
        verifytoken()
      } else {
        history.push('/login')
      }
    }

    const verifytoken = async () => {
      const data = {
        token: window.localStorage.getItem('token')
      }
      if (data.token) {
        await axios.post(nodeapi + 'users/verify', data)
          .then(async res => {
            if (res.data.status === 'ok') {
              const roleId = decodeToken(data.token).role;
              const permission = await getPermissions(roleId, viewId);
              if (!permission.isVisible) {
                history.push('/');
              }
              setIsAuth(true);
            } else {
              window.localStorage.removeItem('token')
              setIsAuth(false)
              history.push('/login')
            }
          })
          .catch(err => err)
      }
    }

    const getPermissions = async (roleId, viewId) => {
      const permission = await axios.get(`${nodeapi}roleviews/find`, {
        params: {
          roleId,
          viewId
        }
      })
        .then(res => {
          if (res.status === 200) {
            setPermissions(res.data);
            return res.data;
          }
        })

      return permission;
    }

    const decodeToken = (token) => {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    }

    checkToken();
  }, [history, isAuth]);

  const onClickSearchButton = () => {
    const { search } = getValues();
    if (search !== '') {
      setSearchValue(search);
    }
  }

  const onClickFormButton = (e) => {
    e.preventDefault();
    setShowModal(true);
    setDataToEdit(null);
  }

  const onClickEditButton = (e, data) => {
    e.preventDefault();
    setShowModal(true);
    setDataToEdit(data);
  }

  const onClickDeleteButton = (e, data) => {
    const deleteCargo = async (data) => {
      return await axios.delete(`${nodeapi}cargos/${data._id}`, data);
    }

    deleteCargo(data);
  }

  const response = async () => {
    await axios.get(`${nodeapi}cargos`)
      .then(res => {
        if (res.status === 200) {
          setCargos(res.data);
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> {ViewName} </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
            <li className="breadcrumb-item active" aria-current="page">{ViewName}</li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Lista de {ViewName}</h4>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Codigo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='table-body-notFound'>
                    {cargos === null || permissions === null ?
                      <th colSpan={3} className='table-body-notFound'>No existen roles</th> :
                      (
                        <ItemPagination
                          url={`cargos/all`}
                          ItemComponent={({ item }) => (
                            <ItemCargo
                              key={item._id}
                              data={item}
                              onEdit={onClickEditButton}
                              onDelete={onClickDeleteButton}
                              permissions={permissions}
                            />
                          )}
                        />
                      )}
                    <tr>
                      <td colSpan={3}>
                        {
                          permissions !== null && permissions.isAddble ?
                            <a
                              href="!#"
                              onClick={(e) => onClickFormButton(e)}
                              className="badge badge-success"
                              style={{ marginRight: '3px', color: 'whitesmoke' }}>
                              Registrar Nuevo
                            </a> : null
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <FormCargo
          data={dataToEdit}
        />
      </Modal>
    </div>
  )
};