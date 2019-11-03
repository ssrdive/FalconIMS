import React, { useState, useEffect } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Store from "@material-ui/icons/Store";
import Accessibility from "@material-ui/icons/Accessibility";
import CardIcon from "components/Card/CardIcon.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import Spinner from "components/UI/Spinner/Spinner";
import CardHeader from "components/Card/CardHeader.js";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import falconAPI from "falcon-api";

const useStyles = makeStyles(styles);

export default function InventoryCount(props){
    const classes = useStyles();

    // State management hooks
    const [countState, setCountState] = useState({
        delivery_document_count: <Spinner />,
        warehouse_count: <Spinner />,
        model_count: <Spinner />,
        user_count: <Spinner />
    });

    // Life cycle hooks
    useEffect(() => {
        falconAPI.post('/count').then(response => {
            response.data.status ? setCountState(response.data.message) :
                setCountState(oldCountState => {
                    return {
                        delivery_document_count: 'N/A',
                        warehouse_count: 'N/A',
                        model_count: 'N/A',
                        user_count: 'N/A'
                    }
                });
        });
    }, []);

    return (
        <GridContainer>
            <GridItem xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="warning" stats icon>
                        <CardIcon color="warning">
                            <Icon>content_copy</Icon>
                        </CardIcon>
                        <p className={classes.cardCategory}>Documents Issued</p>
                        <h3 className={classes.cardTitle}>{countState.delivery_document_count}</h3>
                        <br />
                    </CardHeader>
                </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="success" stats icon>
                        <CardIcon color="success">
                            <Store />
                        </CardIcon>
                        <p className={classes.cardCategory}>Warehouses</p>
                        <h3 className={classes.cardTitle}>{countState.warehouse_count}</h3>
                        <br />
                    </CardHeader>
                </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="danger" stats icon>
                        <CardIcon color="danger">
                            <Icon>info_outline</Icon>
                        </CardIcon>
                        <p className={classes.cardCategory}>Models</p>
                        <h3 className={classes.cardTitle}>{countState.model_count}</h3>
                        <br />
                    </CardHeader>
                </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="info" stats icon>
                        <CardIcon color="info">
                            <Accessibility />
                        </CardIcon>
                        <p className={classes.cardCategory}>Users</p>
                        <h3 className={classes.cardTitle}>{countState.user_count}</h3>
                        <br />
                    </CardHeader>
                </Card>
            </GridItem>
        </GridContainer>
    );
}