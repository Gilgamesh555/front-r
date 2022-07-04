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
        <div className="col-lg-9 grid-margin stretch-card" style={{ marginBottom: '0px' }}>
          <div className="row form-group" style={{ width: '100%', marginLeft: '0' }}>
            <input
              type="search"
              className="col-lg-5 form-control"
              placeholder="Buscar"
              onChange={(e) => setSearchValue(e.target.value)}
              {...register('search')}
            />
            <button
              type="submit"
              className="col-lg-3 btn btn-primary mr-2"
              onClick={onClickSearchButton}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg>  Buscar
            </button>
            {
              permissions && permissions.isAddble && (
                <button
                  className='col-lg-3 btn badge-success mr-2'
                  onClick={(e) => onClickFormButton(e)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
</svg>  Registrar Nuevo
                </button>
              )
            }
          </div>
        </div>
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