import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Spinner from "components/UI/Spinner/Spinner";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import styles from "styles/styles";
import falconAPI from "falcon-api";

import tableClasses from "styles/table.module.css";

const useStyles = makeStyles(styles);

export default function AllWarehouse(props) {
    const classes = useStyles();

    // State management hooks
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        submitted: false,
        messageType: '',
        messageBody: ''
    });

    // Lifecycle hooks
    useEffect(() => {
        setLoading(prevLoading => true);
        falconAPI.post('/warehouse/all')
            .then(response => {
                setLoading(prevLoading => false);
                if (response.data.status) {
                    setWarehouses(prevWarehouses => {
                        return response.data.message;
                    })
                } else {
                    setSubmitStatus({
                        submitted: true, messageType: 'error', messageBody: response.data.message
                    });
                }
            })
            .catch(error => {
                setLoading(prevLoading => false);
                setSubmitStatus({
                    submitted: true,
                    messageType: 'error',
                    messageBody: 'Error occurred during the API call'
                })
            })
    }, []);

    // Interface pre-processing
    const tableBody = (
        <tbody>
            {warehouses.map(warehouse => {
                return <tr
                    key={warehouse.id}>
                    <td><Link to={props.basePath + '/warehouse/edit/' + warehouse.id}>{warehouse.id}</Link></td>
                    <td>{warehouse.name}</td>
                    <td>{warehouse.type}</td>
                    <td>{warehouse.address}</td>
                    <td>{warehouse.territory}</td>
                    <td>{warehouse.telephone}</td>
                </tr>;
            })}
        </tbody>
    );
    let notification = null;
    if (submitStatus.submitted) {
        switch (submitStatus.messageType) {
            case 'error':
                notification = <SnackbarContent message={submitStatus.messageBody} close color="warning" />;
                break;
            case 'success':
                notification = <SnackbarContent message={submitStatus.messageBody} close color="success" />;
                break;
            default:
                notification = null;
                break;
        }
    }
    const pageHeader = loading ? <Spinner /> : notification;

    // Final rendering
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="success">
                        <h4 className={classes.cardTitleWhite}>{props.title}</h4>
                    </CardHeader>
                    <CardBody>
                        {pageHeader}
                        <div className={tableClasses.HelloTable}>
                            <table className={classes.Hello}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Address</th>
                                        <th>Territory</th>
                                        <th>Telephone</th>
                                    </tr>
                                </thead>
                                {tableBody}
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}