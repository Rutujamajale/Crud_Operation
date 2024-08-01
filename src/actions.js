export const addCustomer = (customer) => ({
    type: 'ADD_CUSTOMER',
    payload: customer,
  });
  
  export const editCustomer = (customer) => ({
    type: 'EDIT_CUSTOMER',
    payload: customer,
  });
  
  export const deleteCustomer = (id) => ({
    type: 'DELETE_CUSTOMER',
    payload: id,
  });
  
  export const setCurrentCustomer = (customer) => ({
    type: 'SET_CURRENT_CUSTOMER',
    payload: customer,
  });
  