import React from 'react'
import Navbar from '../Navbar/Navbar';
import Services from './Services';

const DashBoard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' ,}}>
            <Navbar />
            <Services />
        </div>
    )
}

export default DashBoard;