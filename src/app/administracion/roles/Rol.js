import React, { useEffect, useState } from 'react';

import axios from 'axios'
import nodeapi from '../../../apis/nodeapi'

import ItemRole from './Item';
import FormRole from './Form';
import { useForm } from 'react-hook-form';
import './style.css';
import { Views } from '../../../views/Views';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

function Personal({ history }) {
  const { register, getValues } = useForm();
  const ViewName = 'Roles';
  const viewId = Views.roles;
  const [roles, setRoles] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isAuth, setIsAuth] = useState(true);
  const [permissions, setPermissions] = useState(null);

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
    setDataToEdit(null);
  }

  const onClickEditButton = (e, data) => {
    e.preventDefault();
    setDataToEdit(data);
  }

  const onClickDeleteButton = async(e, data) => {
    e.preventDefault();
    const deleteRol = async () => {
      await axios.delete(`${nodeapi}roles/${data._id}`)
    }

    await deleteRol();
    window.location.reload();
  }

  const response = async () => {
    await axios.get(`${nodeapi}roles`)
      .then(res => {
        if (res.status === 200) {
          setRoles(res.data);
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <Element
      id="containerElement"
      style={{
        height: "800px",
        overflow: "scroll",
      }}
    >
    <div>
      <div className="page-header">
        <h3 className="page-title"> {ViewName} </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Administracion</a></li>
            <li className="breadcrumb-item active" aria-current="page">Personal</li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-lg-6 grid-margin stretch-card" style={{ marginBottom: '0px' }}>
          <div className="row form-group" style={{ width: '100%', marginLeft: '0' }}>
            <input
              type="search"
              className="col-lg-8 form-control"
              placeholder="Buscar"
              onChange={(e) => setSearchValue(e.target.value)}
              {...register('search')}
            />
            <button
              type="submit"
              className="col-lg-3 btn btn-primary mr-2"
              onClick={onClickSearchButton}
            >
              Buscar
            </button>
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
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='table-body-notFound'>
                    {roles === null || permissions === null ?
                      <th colSpan={3} className='table-body-notFound'>No existen roles</th> :
                      (
                        roles.filter((item) => {
                          if (searchValue !== '') {
                            const nameFixed = item.name.toLowerCase();
                            const checkIfNameExists = nameFixed.includes(searchValue.toLocaleLowerCase());

                            if (checkIfNameExists) {
                              return item;
                            } else {
                              return null;
                            }
                          } else {
                            if (searchValue === '') {
                              return item;
                            } else {
                              return null;
                            }
                          }
                        })
                      ).map((item) => (
                        <ItemRole
                          key={item._id}
                          data={item}
                          onEdit={onClickEditButton}
                          onDelete={onClickDeleteButton}
                          permissions={permissions}
                        />
                      ))}
                    <tr>
                      <td colSpan={3}>
                        <Link to="FormActivo" spy={true} smooth={true} duration={250} containerId="containerElement">
                        <a
                          href="!#"
                          onClick={(e) => onClickFormButton(e)}
                          className="badge badge-success"
                          style={{ marginRight: '3px', color: 'whitesmoke' }}>
                          Registrar Nuevo
                        </a>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormRole
        data={dataToEdit}
      />
    </div>
    </Element>
  )
}

export default Personal
