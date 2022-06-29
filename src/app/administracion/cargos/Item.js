import React from 'react';
import { Dropdown } from 'react-bootstrap';

export default function CargoItem({ data, onEdit, onDelete, permissions }) {
  const { name, code } = data;

  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{code}</td>
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
                      }}>Modificar</span>
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