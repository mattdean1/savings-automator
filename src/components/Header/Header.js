import React from 'react'
import { Link } from 'react-router'
import { Menu, Image, Icon } from 'semantic-ui-react'
import logo from '../../assets/safe-logo.png'

const styles = {
  header : {
    boxShadow: 'none'
  }
};

export const Header = () => (
  <div>
    <Menu fixed='top' inverted style={styles.header}>
      <Link to='/'>
        <Menu.Item className=''>
          {/* <Image src='' className='ui image' alt='Back' width='60px' /> */}
          <p style={{ color: '#1E1937' }} className='brand'>Automatic Savings</p>
        </Menu.Item>
      </Link>
    </Menu>
  </div>
)

export default Header
