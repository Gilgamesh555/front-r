import React, { createRef, useEffect, useState } from "react";
import axios from "axios";
import api from "../../apis/nodeapi";
import ReactPaginate from 'react-paginate';

export const ItemPagination = ({ url, ItemComponent }) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOffset, setPageOffset] = useState(0);
  const componentRef = createRef();

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
      setCurrentItems(res.data.docs);
      setPageCount(res.data.totalPages);
    }
    catch (error) { }
  }

  const handlePageClick = (event) => {
    const pageNumber = event.selected + 1;
    setPageOffset(pageNumber);
    componentRef.current.scrollIntoView();
  }

  return (
    <div
      ref={componentRef} 
    >
      <ItemsOnPage
        currentItems={currentItems}
        ItemComponent={ItemComponent}
      />
      <div className='paginateContainer'>
        <ReactPaginate
          nextLabel="> "
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
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
        />
      </div>
    </ div>
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
