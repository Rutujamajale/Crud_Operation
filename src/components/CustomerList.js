import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCustomer, setCurrentCustomer } from '../actions';

const CustomerList = () => {
  const customers = useSelector((state) => state.customers.customers);
  const dispatch = useDispatch();

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };
  
  const thStyle = {
    border: '1px solid black',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  };
  
  const tdStyle = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
  };
  
  const buttonStyle = {
    margin: '0 5px',
    padding: '5px 10px',
    cursor: 'pointer',
  };

  return (
    <div>
      <h2>Customer List</h2>
      <table style={tableStyle}>
    <thead>
      <tr>
        <th style={thStyle}>Full Name</th>
        <th style={thStyle}>Email</th>
        <th style={thStyle}>Mobile Number</th>
        <th style={thStyle}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {customers.map((customer) => (
        <tr key={customer.id}>
          <td style={tdStyle}>{customer.fullName}</td>
          <td style={tdStyle}>{customer.email}</td>
          <td style={tdStyle}>{customer.mobileNumber}</td>
          <td style={tdStyle}>
            <button style={buttonStyle} onClick={() => dispatch(deleteCustomer(customer.id))}>Delete</button>
            <button style={buttonStyle} onClick={() => dispatch(setCurrentCustomer(customer))}>Edit</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
    </div>
  );
};

export default CustomerList;
