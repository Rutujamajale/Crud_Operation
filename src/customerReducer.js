const initialState = {
    customers: [],
    currentCustomer: null,
  };
  
  const customerReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_CUSTOMER':
        return { ...state, customers: [...state.customers, action.payload] };
      case 'EDIT_CUSTOMER':
        return {
          ...state,
          customers: state.customers.map((customer) =>
            customer.id === action.payload.id ? action.payload : customer
          ),
          currentCustomer: null,
        };
      case 'DELETE_CUSTOMER':
        return {
          ...state,
          customers: state.customers.filter((customer) => customer.id !== action.payload),
        };
      case 'SET_CURRENT_CUSTOMER':
        return { ...state, currentCustomer: action.payload };
      default:
        return state;
    }
  };
  
  export default customerReducer;
  