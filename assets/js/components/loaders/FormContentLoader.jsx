import React from 'react';
import ContentLoader from 'react-content-loader';

const FormContentLoader = (props) => {
  return (
    <ContentLoader
      width={800}
      height={300}
      speed={2}
      viewBox="0 0 1300 400"
      backgroundColor="white"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="0" rx="0" ry="0" width="500" height="25" />
      <rect x="0" y="80" rx="0" ry="0" width="151" height="15" />
      <rect x="0" y="105" rx="0" ry="0" width="719" height="25" />
      <rect x="0" y="150" rx="0" ry="0" width="151" height="15" />
      <rect x="0" y="175" rx="0" ry="0" width="719" height="25" />
      <rect x="0" y="220" rx="0" ry="0" width="151" height="15" />
      <rect x="0" y="245" rx="0" ry="0" width="719" height="25" />
      <rect x="0" y="290" rx="0" ry="0" width="130" height="30" />
    </ContentLoader>
  );
};

export default FormContentLoader;
