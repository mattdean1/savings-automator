import React from 'react'
import Header from '../../components/Header'
import '../../styles/core.scss'
import { Container } from 'semantic-ui-react'

export const CoreLayout = ({ children }) => (
  <div className="fw fh">
    <div className="headerMargin">
    <Header />
    </div>
    <Container>
      {children}
    </Container>
  </div>
);

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};

export default CoreLayout
