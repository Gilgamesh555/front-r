import React from 'react';
import './style.css';
import { Dropdown } from 'react-bootstrap';

function ItemRole({ data, onEdit, onDelete, permissions }) {
  const { name, status } = data;

  return (
    <>
      <tr>
        <td>{name}</td>
        <td className={status === 'activo' ? 'text-success' : 'text-danger'}>
          {status} <i className={status === 'activo' ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'}></i>
        </td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic"></Dropdown.Toggle>
            <Dropdown.Menu>
              {
                (permissions !== undefined && permissions !== null)
                && permissions.isEditable
                && (
                  <Dropdown.Item
                    href="#/action-2"
                    onClick={(e) => onEdit(e, data)}
                  >
                    <span

                      style={{
                        fontSize: '14px',
                      }}>Editar</span>
                  </Dropdown.Item>
                )
              }
              {
                (permissions !== undefined && permissions !== null)
                && permissions.isDeletable
                && (
                  <Dropdown.Item
                    href="#/action-2"
                    onClick={(e) => onDelete(e, data)}
                  >
                    <span

                      style={{
                        fontSize: '14px',
                      }}>Eliminar</span>
                  </Dropdown.Item>
                )
              }
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    </>
  )
}

export default ItemRole;
