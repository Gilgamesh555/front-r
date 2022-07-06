import React, { createRef, Fragment, useEffect, useState } from "react";
import axios from "axios";
import api from "../../apis/nodeapi";
import ReactPaginate from 'react-paginate';

export const ItemPagination = ({ url, ItemComponent, componentRef }) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOffset, setPageOffset] = useState(0);

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [pageOffset])

  const fetchData = async () => {
    try {
      const res = await axios.get(`${api}${url}`, {
        params: {
          pageNumber: pageOffset,
        }
      });
      if (url === 'activos/all') {
        let newDocs = res.data.docs.map(async item => {
          const getCurrentPdfReportBaja = async (id) => {
            const res = await axios.get(`${api}activoBaja/byActivoId/${id}`)
            try {
              const { data } = res;
              return data.pdfPath;
            } catch (error) { }
            return null;
          }
          item.pdfPath = await getCurrentPdfReportBaja(item._id)
          return item;
        });
        newDocs = await Promise.all(newDocs)
        setCurrentItems(newDocs)
      } else {
        setCurrentItems(res.data.docs);
      }
      setPageCount(res.data.totalPages);
    }
    catch (error) { }
  }

  const handlePageClick = (event) => {
    const pageNumber = event.selected + 1;
    setPageOffset(pageNumber);
    if (componentRef) {
      componentRef.current.scrollIntoView();
    }
  }

  return (
    <>
      <ItemsOnPage
        currentItems={currentItems}
        ItemComponent={ItemComponent}
      />
      <tr>
        <td colSpan={10}>
          <div
            className='paginateContainer'
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: componentRef ? '2em' : '0em'
            }}
          >
            <ReactPaginate
              nextLabel="> "
              onPageChange={handlePageClick}
              pageRangeDisplayed={10}
              pageCount={pageCount}
              previousLabel="< "
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
              style={{
                justifyContent: 'center'
              }}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export const ItemsOnPage = ({ ItemComponent, currentItems }) => {
  return (
    <>
      {
        currentItems && currentItems.map(item => <ItemComponent item={item} />)
      }
    </>
  )
}
