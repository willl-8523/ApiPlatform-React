import { error } from 'jquery';
import React from 'react';

const Select = ({ name, value, label, onChange, children, error }) => {
  return (
    <div className='form-group'>
      {/* div.form-group>label+select.from-control */}

      <label htmlFor={name}>{label}</label>
      <select
        onChange={onChange}
        name={name}
        id={name}
        value={value}
        className={'custom-select' + (error && ' is-invalid')}
      >
        {children}
      </select>
      <p className='invalid-feedback'>erreur</p>
    </div>
  );
};

export default Select;
