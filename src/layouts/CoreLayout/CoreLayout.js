import React from 'react'
import Header from '../../components/Header'
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <div className="fw fh">
    <div className="headerMargin">
    <Header />
    </div>
    <div className="fw fh">
      {children}
      <br/>
    </div>
  </div>
);

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};

export default CoreLayout
