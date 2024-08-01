import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';

function App() {
  return (

    <Provider store={store}>
      <div className="App">
        <CustomerForm />
        <CustomerList />
      </div>
    </Provider>

  );
}

export default App;
