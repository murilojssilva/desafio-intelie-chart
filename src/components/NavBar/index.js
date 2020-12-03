import React from 'react';
import { Navbar } from "react-bootstrap";

export default function NavBar(){
    return (
        <Navbar className="nav-bar" fixed="top">
            <Navbar.Brand style={{'fontWeight': 'bold'}}>Murilo's Challenge</Navbar.Brand>
        </Navbar>
    )
}