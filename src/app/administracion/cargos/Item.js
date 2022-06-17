import React from 'react';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

export default function CargoItem({ data, onEdit, onDelete, permissions }) {
  const { name, code } = data;

  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{code}</td>
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
              <Link to="FormActivo" spy={true} smooth={true} duration={250} containerId="containerElement">
              <a
                href="!#"
                onClick={(e) => onEdit(e, data)}
                className="badge badge-warning"
                style={{ marginRight: '3px' }}
              >
                Modificar
              </a>
              </Link>
            )
          }
          {
            (permissions !== undefined && permissions !== null)
            && permissions.isDeletable
            && (
              <a
                href="/administracion/cargos"
                onClick={(e) => onDelete(e, data)}
                className="badge badge-danger"
                style={{ marginRight: '3px' }}
              >
                Eliminar
              </a>
            )
          }
        </td>
      </tr>
    </>
  )
}