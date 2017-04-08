import React from 'react'
import { Link } from 'react-router'
import { Menu, Image, Icon } from 'semantic-ui-react'
import logo from '../../assets/safe-logo.png'

export const Header = () => (
  <div>
    <Menu fixed='top' inverted>
      <Link to='/'>
        <Menu.Item className=''>
          <Image src='' className='ui image' alt='Back' width='60px' />
          <p className='brand'>Automatic Savings</p>
        </Menu.Item>
      </Link>
    </Menu>
  </div>
)

export default Header
