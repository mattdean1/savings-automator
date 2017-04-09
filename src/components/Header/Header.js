import React from 'react'
import { Link } from 'react-router'
import { Menu, Image, Icon } from 'semantic-ui-react'
import logo from '../../assets/safe-logo.png'

const styles = {
  header : {
    boxShadow: 'none',
    backgroundColor: '#1E1937',
    fontFamily: 'Helvetica Neue',
    fontWeight: 100,
  }
};

export const Header = () => (
  <div>
    <Menu fixed='top' inverted style={styles.header} fluid widths={1}>
        <Menu.Item className='' style={{borderRight: 0}}>
          {/* <Image src='' className='ui image' alt='Back' width='60px' /> */}
          <h1 style={{ color: 'white', fontWeight: '100', letterSpacing: '5px'}}>STARLING SAVINGS AUTOMATOR</h1>
        </Menu.Item>
    </Menu>
  </div>
)

export default Header
