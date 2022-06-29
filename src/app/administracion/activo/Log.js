import React, { createRef } from 'react';
import './logstyle.css';
import { Modal } from 'react-bootstrap';
import { ItemPagination } from '../ItemPagination';

export default function Log({ data }) {
  const { _id } = data;
  const url = `logs/getByActivo/${_id}`;
  const componentRef = createRef();

  const ItemComponet = ({ item }) => {
    const date = new Date(item.date).toLocaleString();

    return (
      <div className='cardz'>
        <div className='info'>
          <h2 className='title'>{date}</h2>
          {
            item.description.split('\n').map(item => <p>{item}</p>)
          }
        </div>
      </div>
    )
  }

  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Bitacora De Activo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='timeline'>
          <div className='outer'
            ref={componentRef}
          >
            <ItemPagination
              url={url}
              ItemComponent={ItemComponet}
              componentRef={componentRef}
            />
          </div>
        </div>
      </Modal.Body>
    </div>
  )
}