import React from 'react';
import { Link } from 'react-router-dom';

import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import Success from "components/Typography/Success.js";
import Info from "components/Typography/Info.js";

export default function UserAdmin(props) {
    return(
        <React.Fragment>
            <GridItem xs={12} sm={12} md={12}>
                <Info><h4 style={{ margin: '0 0 5px 0' }}>User Administration</h4></Info>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
                <Success>Create</Success>
                <Link to='/app/inventory/user/add'><Button type='button' color='info'>Add User</Button></Link>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
                <Success>View</Success>
                <Link to='/app/inventory/user/all'><Button type='button' color='info'>View Users</Button></Link>
            </GridItem>
        </React.Fragment>
    );
}