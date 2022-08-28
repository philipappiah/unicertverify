import React from "react"
import {IntlProvider} from 'react-intl'
import {SideNavProps} from '../../types'
import Layout from "./Layout";
import './sidenav.css';

const Labels = {
        title: 'Home',
        sidebarTitle:'Home',
        description:
          'React sidebar library with dropdown menus and unlimited number of nested submenus',
        dashboard: 'Dashboard',
        components: 'Components',
        dropdown: 'Dropdown',
        submenu: 'Submenu',
        multiLevel: 'Multi Level',
        collapsed: 'Collapsed',
        rtl: 'RTL',
        image: 'Background image'
    }





export default function SideNav({isCollapsed, toggleCollapse}:SideNavProps){

    return (
        <IntlProvider locale="en" messages={Labels}>
        <Layout isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
        </IntlProvider>
    )

}
