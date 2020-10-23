import React from 'react';
import './NavBarStyle.css'
import {Link} from 'react-router-dom'
import {Menu} from 'semantic-ui-react'
import logo from "./logo.png"

export const NavBarComponent = () => {
    return (

        <div className={'wbdv-navbar'}>
            <div style={{background: 'white', transition: 'background-color 300ms linear'}}>
                <Menu secondary>
                    <Menu.Item
                        as={Link}
                        to={'/'}
                    >
                        <div className={'logo'}><img width={150} alt={'logo'} src={logo}/></div>
                    </Menu.Item>
                </Menu>
            </div>
        </div>
    );
};

export default NavBarComponent