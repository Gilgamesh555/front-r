import React, { useEffect, useState } from 'react';
import './logstyle.css';
import { Modal } from 'react-bootstrap';
import nodeapi from '../../../apis/nodeapi';

import axios from 'axios';

export default function Log({ data }) {
  const { _id } = data;
  const [logs, setLogs] = useState([]);
  const [newLogs, setNewLogs] = useState([]);

  useEffect(() => {
    getLogs();
  }, [])

  const getLogs = async () => {
    let logsz = await axios.get(`${nodeapi}logs/getByActivo/${_id}`);
    let logszz = logsz.data.map(async (item) => {
      const date = new Date(item.date).toISOString().slice(0, 10)
      let userName = 'Jhon Doe';

      try {
        let user = await axios.get(`${nodeapi}users/${item.userId}`);
        user = user.data;
        userName = `${user.nombre} ${user.apPaterno} ${user.apMaterno}`;
      } catch (error) {
        console.log(error)
      }

      return {
        date,
        description: `${userName} =>  ${item.description}`
      }
    });
    logszz = await Promise.all(logszz);
    setLogs(logszz);
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Bitacora De Activo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='timeline'>
          <div className='outer'>
            {
              logs.map(item => (
                <div className='cardz'>
                  <div className='info'>
                    <h2 className='title'>{item.date}</h2>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </Modal.Body>
    </>
  )
}