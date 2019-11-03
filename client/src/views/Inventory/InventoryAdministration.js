import React from 'react';
import { Link } from 'react-router-dom';

import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import Success from "components/Typography/Success.js";
import Info from "components/Typography/Info.js";

export default function InventoryAdministration(props) {
    return(
        <React.Fragment>
            <GridItem xs={12} sm={12} md={12}>
                <Info><h4 style={{ margin: '0 0 5px 0' }}>Inventory Administration</h4></Info>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
                <Success>Models</Success>
                <Link to='/app/inventory/model/all'><Button type='button' color='info'>All Models</Button></Link>
                <Link to='/app/inventory/model/add'><Button type='button' color='info'>Add Model</Button></Link>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
                <Success>Warehouses</Success>
                <Link to='/app/inventory/warehouse/all'><Button type='button' color='info'>All Warehouses</Button></Link>
                <Link to='/app/inventory/warehouse/add'><Button type='button' color='info'>Add Warehouse</Button></Link>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
                <Success>Regions</Success>
                <Link to='/app/inventory/region/all'><Button type='button' color='info'>All Regions</Button></Link>
                <Link to='/app/inventory/region/add'><Button type='button' color='info'>Add Region</Button></Link>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
                <Success>Territories</Success>
                <Link to='/app/inventory/territory/all'><Button type='button' color='info'>All Territories</Button></Link>
                <Link to='/app/inventory/territory/add'><Button type='button' color='info'>Add Territory</Button></Link>
            </GridItem>
        </React.Fragment>
    );
}