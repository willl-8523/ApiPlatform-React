import React, { useState } from 'react';

const HomePage = () => {
  const [learnMore, setLearMore] = useState(false);

  const handleClick = () => {
    setLearMore(!learnMore);
  };

  return (
    <div className="jumbotron">
      <h4 className=" text-center">
        Bienvenue sur notre plateforme de gestion complète des utilisateurs, des
        clients et des factures.
      </h4>
      <hr className="my-4" />
      <p className="lead px-3">
        Notre application web est conçue pour simplifier et automatiser la
        gestion de votre entreprise, en offrant une suite d'outils puissants et
        conviviaux.
        <br />
        <br />
        Notre application vous permet de gérer efficacement vos utilisateurs en
        leur attribuant des rôles et des autorisations spécifiques, ce qui
        garantit une sécurité renforcée et un accès restreint aux informations
        sensibles. <br />
        Notre interface intuitive vous permet de vous inscrire facilement à
        l'application et notre vous offre une fonctionnalité complète de gestion
        des clients. Vous pouvez enregistrer les détails de vos clients, tels
        que leurs coordonnées, leurs factures et le status de leurs factures
        d'achat. <br />
        <br />
        Avec notre système de recherche, vous pouvez retrouver rapidement les
        vos clients ou vos factures et suivre leur évolution au fil du temps. La
        gestion des factures est également simplifiée grâce à notre application.
        Notre système de suivi des paiements vous permet de garder une trace
        précise du status des factures (envoyées, payées et impayées...), vous
        aidant ainsi à maintenir un flux de trésorerie stable.
      </p>
      <p className={!learnMore ? 'lead px-3 d-none' : 'lead px-3 d-block'}>
        Nous avons mis l'accent sur la convivialité et la simplicité
        d'utilisation de notre application, même pour les utilisateurs novices
        en informatique. Nous avons également pris soin de rendre notre
        application compatible avec différents appareils et navigateurs, vous
        permettant de gérer votre entreprise en déplacement. Soyez assuré que
        nous accordons une grande importance à la sécurité de vos données. Notre
        application utilise les dernières technologies de cryptage et de
        protection des données, garantissant la confidentialité et l'intégrité
        de vos informations sensibles. <br />
        <br />
        Donnez à votre entreprise un avantage concurrentiel en utilisant notre
        application de gestion des utilisateurs, des clients et des factures.{' '}
        <br />
        Simplifiez vos processus, améliorez votre efficacité et offrez un
        service exceptionnel à vos clients. Inscrivez-vous dès aujourd'hui et
        découvrez comment notre application peut transformer votre gestion
        quotidienne.
      </p>
      <button
        type="button"
        className="btn btn-primary mx-3"
        onClick={handleClick}
      >
        {!learnMore ? 'Voir plus' : 'Voir moins'}
      </button>
    </div>
  );
};

export default HomePage;
