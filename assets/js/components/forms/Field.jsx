import React from 'react';

const Field = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = label,
  error = '',
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        id={name}
        className={'form-control' + (error && ' is-invalid')}
        name={name}
        placeholder={placeholder}
      />
      {/* 
            invalid-feedback => affiche p si l'info de input n'est pas valid
            pour cela rajouter la classe is-invalid
            <p className="invalid-feedback">
            Aucun compte ne possède cette adresse ou les informations ne
            correspondent pas
            </p>
        */}
      {error && <p className="invalid-feedback">{error}</p>}
    </div>
  );
};

export default Field;
