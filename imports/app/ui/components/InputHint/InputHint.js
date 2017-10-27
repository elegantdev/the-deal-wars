// react
import React from 'react';
import PropTypes from 'prop-types';

// app
import './InputHint.scss';

const InputHint = ({ children }) => (
  <div className="InputHint">
    {children}
  </div>
);

InputHint.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputHint;
