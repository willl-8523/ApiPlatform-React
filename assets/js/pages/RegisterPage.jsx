import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field from '../components/forms/Field';
import usersAPI from '../usersAPI';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
      setErrors(apiErrors);
      return;
    }

    try {
      await usersAPI.register(user);

      setErrors({});
      
      // Notification flash d'un succès
      toast.success(
        `Vous êtes desormais inscris, vous pouvez vous connecter !`
      );
      navigate('/login', { replace: true });
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        violations.forEach(({ propertyPath, message }) => {
          if (!apiErrors[propertyPath]) {
            apiErrors[propertyPath] = message;
          }
        });
        setErrors(apiErrors);

        // Notification flash erreurs
        toast.error(`Des erreurs dans votre formulaire !`);
      }
      console.log(user);
    }
  };

  return (
    <>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <Field
          name={'firstName'}
          label={'Prénom'}
          placeholder={'Votre prénom'}
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        />
        <Field
          name={'lastName'}
          label={'Nom'}
          placeholder={'Votre nom'}
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        />
        <Field
          name={'email'}
          label={'Email'}
          placeholder={'Votre email'}
          error={errors.email}
          value={user.email}
          type={'email'}
          onChange={handleChange}
        />
        <Field
          name={'password'}
          label={'Mot de passe'}
          placeholder={'Votre mot de passe'}
          error={errors.password}
          value={user.password}
          type={'password'}
          onChange={handleChange}
        />
        <Field
          name={'passwordConfirm'}
          label={'Confirmation de mot de passe'}
          placeholder={'Confirmez votre mot de passe'}
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          type={'password'}
          onChange={handleChange}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success" formNoValidate>
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
