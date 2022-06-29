import React from 'react';
import './logstyle.css';
import { Modal } from 'react-bootstrap';
import { ItemPagination } from '../ItemPagination';

export default function Log({ data }) {
  const { _id } = data;
  const url = `logs/getByActivo/${_id}`;

  const ItemComponet = ({ item }) => (
      <div className='cardz'>
        <div className='info'>
          <h2 className='title'>{item.date}</h2>
          {
            item.description.split('\n').map(item => <p>{item}</p>)
          }
        </div>
      </div>
  )

  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Bitacora De Activo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='timeline'>
          <div className='outer'>
              <ItemPagination
                url={url}
                ItemComponent={ItemComponet}
              />
          </div>
        </div>
      </Modal.Body>
    </div>
  )
}