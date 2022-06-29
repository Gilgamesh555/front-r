import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import nodeapi from '../../../apis/nodeapi';

export default function TransferActives() {
  const [users, setUsers] = useState(null);
  const [firstUser, setFirstUser] = useState(null);
  const [secondUser, setSecondUser] = useState(null);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get(`${nodeapi}users`);
      console.log(response.data);
      setUsers(response.data);
    }
    getUsers();
  }, [])

  const handleFirstUser = (event) => {
    setFirstUser(event.target.value);
  }

  const handleSecondUser = (event) => {
    setSecondUser(event.target.value);
  }

  const onUpdate = async (dataFromForm) => {
    const transferActive = async (data) => {
      return await axios.put(`${nodeapi}activos/modify`, data);
    }

    const data = {
      firstUserId: dataFromForm['firstUser'],
      secondUserId: dataFromForm['secondUser'],
      usuarioId: getUser()
    }

    transferActive(data);

    window.location.reload();
  }

  const getUser = () => {
    const token = window.localStorage.getItem('token');
    const user = decodeToken(token).id;
    return user;
  }

  const decodeToken = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Transferir Activos</h4>
        <form
          className="form-sample"
          onSubmit={handleSubmit(onUpdate)}
        >
          <p className="card-description"> Escoja sus usuarios </p>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Usuario Base</label>
                <div className="col-sm-9">
                  <select
                    className="form-control"
                    required
                    id="inputRole"
                    onChange={handleFirstUser}
                    {...register(`firstUser`)}
                  >
                    <option hidden value=''>Escoga un Usuario</option>
                    {
                      users !== null && (
                        users.map((item) => (
                          <option value={item._id} key={item._id}>
                            {`${item.nombre} ${item.apPaterno} ${item.apMaterno}`}
                          </option>
                        ))
                      )
                    }
                  </select>
                </div>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Usuario A Transferir</label>
                <div className="col-sm-9">
                  <select
                    className="form-control"
                    required
                    id="inputRole"
                    onChange={handleSecondUser}
                    {...register(`secondUser`)}
                  >
                    <option hidden value=''>Escoga un Usuario</option>
                    {
                      users !== null && (
                        users.map((item) => (
                          <option value={item._id} key={item._id}>
                            {`${item.nombre} ${item.apPaterno} ${item.apMaterno}`}
                          </option>
                        ))
                      )
                    }
                  </select>
                </div>
              </Form.Group>
            </div>
          </div>
          <div className="col-md-6">
            <button type="submit" className="btn btn-primary mr-2">Transferir</button>
            <button className="btn btn-light" type='reset'>Borrar Datos</button>
          </div>
        </form>
      </div>
    </div>
  );
}