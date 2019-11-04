import React from 'react';

import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { useAuth } from "context/auth";

import StocksReports from 'views/Inventory/StocksReports';
import InventoryCount from 'views/Inventory/InventoryCount';
import InventoryTransactions from 'views/Inventory/InventoryTransactions';
import InventoryAdministration from 'views/Inventory/InventoryAdministration';
import UserAdmin from 'views/Inventory/UserAdmin';
import AgewiseReport from 'views/Inventory/AgewiseReport';

const useStyles = makeStyles(styles);

export default function InventoryRoot(props) {
    const classes = useStyles();
    const { loggedUser } = useAuth();
    const user = JSON.parse(loggedUser);

    // State management hooks


    // Life cycle hooks


    // Functions


    // Interface pre-processing

    return (
        <React.Fragment>
            {('Count' in user.accessLevel) ?
                <InventoryCount />
                : null}
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="success">
                            <h4 className={classes.cardTitleWhite}>{props.title}</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                {('ViewStocks' in user.accessLevel) ?
                                    <StocksReports {...props} />
                                    : null}
                                {('AgewiseReport' in user.accessLevel) ?
                                    <AgewiseReport {...props} />
                                    : null}
                                {('InventoryTransactions' in user.accessLevel) ?
                                    <InventoryTransactions {...props} />
                                    : null}
                                {('InventoryAdministration' in user.accessLevel) ?
                                    <InventoryAdministration />
                                    : null}
                                {('UserAdmin' in user.accessLevel) ?
                                    <UserAdmin />
                                    : null}
                            </GridContainer>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </React.Fragment>
    );
}