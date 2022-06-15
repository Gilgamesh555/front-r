import React from 'react';
import './style.css';

function ItemRole({ data, onEdit, permissions }) {
  const { name, status } = data;

  console.log(permissions);

  return (
    <>
      <tr>
        <td>{name}</td>
        <td className={status === 'activo' ? 'text-success' : 'text-danger'}>
          {status} <i className={status === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
        </td>
        <td>
          {/* <a
            href="!#"
            onClick={(e) => modifyItem(e)}
            className="badge badge-success"
            style={{ marginRight: '3px' }}
          >
            Detalles
          </a> */}
          {
            (permissions !== undefined && permissions !== null)
            && permissions.isEditable
            && (
              <>
                {/*<a
                  href="!#"
                  className="badge badge-info"
                  style={{ marginRight: '3px' }}
                >
                  Mod Estado
            </a>*/}
                <a
                  href="!#"
                  onClick={(e) => onEdit(e, data)}
                  className="badge badge-warning"
                  style={{ marginRight: '3px' }}
                >
                  Modificar
                </a>
              </>
            )
          }
        </td>
      </tr>
    </>
  )
}

export default ItemRole;
