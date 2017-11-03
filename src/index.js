import React from 'react';
import { Provider } from 'react-redux';
import getStore from 'store/getStore';
import Camera from 'components/Camera/Camera.render';

const Root = () => (
  <Provider store={getStore()}>
    <Camera />
  </Provider>
);

export default Root;
