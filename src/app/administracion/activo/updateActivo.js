import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import nodeapi from '../../../apis/nodeapi';

export default function UpdateActivo(props) {
  const date = new Date();
  const futureDate = date.getDate();
  date.setDate(futureDate);
  const defaultDate = date.toLocaleDateString('en-CA');
  const { activo } = props;

  const { register, handleSubmit } = useForm();

  const onUpdate = async (dataFromForm) => {
    const modifyActivo = async (data) => {
      return await axios.put(`${nodeapi}activos/${data._id}`, data)
    }

    const getActualUfvDate = async (data) => {
      const ufv = await axios.post(`${nodeapi}ufv/date`, data);
      return ufv.data.valor;
    }

    const beginDate = {
      fecha: dataFromForm['beginDate']
    };

    const endDate = {
      fecha: dataFromForm['endDate']
    };

    const ufvBeginDate = parseFloat(await getActualUfvDate(beginDate));
    const ufvEndDate = parseFloat(await getActualUfvDate(endDate));

    const updatedValue = activo.costoInicial * (ufvBeginDate / ufvEndDate - 1);

    await modifyActivo({
      ...activo,
      costoInicial: updatedValue.toString(),
    });

    window.location.reload();
  }

  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Actualizar Activo</h4>
          <form className="form-sample" onSubmit={handleSubmit(onUpdate)}>
            <p className="card-description"> Actualizar Valor de Activo </p>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">Fecha Inicio</label>
                  <div className="col-sm-9">
                    <Form.Control
                      type="date"
                      id="inputFechaIncorporacion"
                      required
                      defaultValue={defaultDate}
                      max={defaultDate}
                      {...register(`beginDate`)}
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">Fecha Fin</label>
                  <div className="col-sm-9">
                    <Form.Control
                      type="date"
                      id="inputFechaIncorporacion"
                      required
                      defaultValue={defaultDate}
                      max={defaultDate}
                      {...register(`endDate`)}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>
            <div className="col-md-6">
              <button type="submit" className="btn btn-primary mr-2">Obtener Actualizacion</button>
              <button className="btn btn-light" type='reset'>Borrar Datos</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
