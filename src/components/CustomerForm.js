import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addCustomer, editCustomer } from '../actions';
import './CustomerForm.css'; 
const CustomerForm = () => {
  const currentCustomer = useSelector((state) => state.customers.currentCustomer);
  const [formData, setFormData] = useState({
    pan: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    addresses: [{ line1: '', line2: '', postcode: '', state: '', city: '' }],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentCustomer) {
      setFormData(currentCustomer);
    }
  }, [currentCustomer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, e) => {
    const newAddresses = formData.addresses.map((address, addrIndex) => {
      if (index !== addrIndex) return address;
      return { ...address, [e.target.name]: e.target.value };
    });
    setFormData({ ...formData, addresses: newAddresses });
  };

  const addAddress = () => {
    setFormData({ ...formData, addresses: [...formData.addresses, { line1: '', line2: '', postcode: '', state: '', city: '' }] });
  };

  const handlePanChange = async (e) => {
    const pan = e.target.value.toUpperCase();
    setFormData({ ...formData, pan });

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      setErrors({ ...errors, pan: 'Invalid PAN format' });
      return;
    } else {
      setErrors({ ...errors, pan: null });
    }

    if (pan.length === 10 && panRegex.test(pan)) {
      setLoading(true);
      try {
        const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber: pan });
        if (response.data.isValid) {
          setFormData({ ...formData, pan, fullName: response.data.fullName });
        } else {
          setErrors({ ...errors, pan: 'PAN is not valid' });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePostcodeChange = async (index, e) => {
    const postcode = e.target.value;
    const newAddresses = formData.addresses.map((address, addrIndex) => {
      if (index !== addrIndex) return address;
      return { ...address, postcode };
    });
    setFormData({ ...formData, addresses: newAddresses });

    if (postcode.length === 7) {
      setLoading(true);
      try {
        const response = await axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode });
        const { city, state } = response.data;
        const updatedAddresses = formData.addresses.map((address, addrIndex) => {
          if (index !== addrIndex) return address;
          return { ...address, city: city[0].name, state: state[0].name };
        });
        setFormData({ ...formData, addresses: updatedAddresses });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pan) newErrors.pan = 'PAN is required';
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.pan)) newErrors.pan = 'Invalid PAN format';
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (formData.fullName.length > 140) newErrors.fullName = 'Full Name cannot exceed 140 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.email.length > 255) newErrors.email = 'Email cannot exceed 255 characters';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Invalid mobile number format';

    formData.addresses.forEach((address, index) => {
      if (!address.line1) newErrors[`line1-${index}`] = 'Address Line 1 is required';
      if (!/^\d{6}$/.test(address.postcode)) newErrors[`postcode-${index}`] = 'Invalid postcode format';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (currentCustomer) {
      dispatch(editCustomer({ ...formData, id: currentCustomer.id }));
    } else {
      dispatch(addCustomer({ ...formData, id: Date.now() }));
    }

    setFormData({
      pan: '',
      fullName: '',
      email: '',
      mobileNumber: '',
      addresses: [{ line1: '', line2: '', postcode: '', state: '', city: '' }],
    });
  };

  return (
    <div className="form-container">
      <h2>Customer Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="pan"
            placeholder="PAN"
            value={formData.pan}
            onChange={handlePanChange}
            required
          />
          {loading && <span>Loading...</span>}
          {errors.pan && <span>{errors.pan}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          {errors.fullName && <span>{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
          {errors.mobileNumber && <span>{errors.mobileNumber}</span>}
        </div>
        {formData.addresses.map((address, index) => (
          <div key={index} className="address-group">
            <div className="form-group">
              <input
                type="text"
                name="line1"
                placeholder="Address Line 1"
                value={address.line1}
                onChange={(e) => handleAddressChange(index, e)}
                required
              />
              {errors[`line1-${index}`] && <span>{errors[`line1-${index}`]}</span>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="line2"
                placeholder="Address Line 2"
                value={address.line2}
                onChange={(e) => handleAddressChange(index, e)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="postcode"
                placeholder="Postcode"
                value={address.postcode}
                onChange={(e) => handlePostcodeChange(index, e)}
                required
              />
              {errors[`postcode-${index}`] && <span>{errors[`postcode-${index}`]}</span>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                readOnly
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                readOnly
              />
            </div>
          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={addAddress}>Add Address</button>
          <button type="submit" disabled={loading}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
