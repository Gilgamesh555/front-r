import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import nodeapi from '../../../apis/nodeapi';

export default function DeprecateActivo(props) {
  const { activo } = props;

  const { register, handleSubmit } = useForm();

  const onDeprecate = async (dataFromForm) => {
    const modifyActivo = async (data) => {
      return await axios.put(`${nodeapi}activos/${data._id}`, data)
    }

    const getCurrentCoe = async (data) => {
      const coe = await axios.get(`${nodeapi}grupos/${data.grupoId}`);
      return parseInt(coe.data.coe);
    }

    const deprecatedValue = activo.costoInicial * (await getCurrentCoe(activo) / 100);
    const valueByMonth = (deprecatedValue / 12) * dataFromForm['deprecateMonths'];
    let finalValue = activo.costoInicial - valueByMonth;
    finalValue = Number(finalValue).toFixed(2);

    await modifyActivo({
      ...activo,
      costoInicial: finalValue.toString(),
    });

    window.location.reload();
  }

  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Depreciar Activo</h4>
          <form className="form-sample" onSubmit={handleSubmit(onDeprecate)}>
            <p className="card-description">Depreciar Activo </p>
            <div className="row">
              <div className="col-md-12">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">Numero de Meses</label>
                  <div className="col-sm-9">
                    <Form.Control
                      type="number"
                      id="inputFechaIncorporacion"
                      required
                      defaultValue={12}
                      {...register(`deprecateMonths`)}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>
            <div className="col-md-6">
              <button type="submit" className="btn btn-primary mr-2">Obtener Depreciacion</button>
              <button className="btn btn-light" type='reset'>Borrar Datos</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
