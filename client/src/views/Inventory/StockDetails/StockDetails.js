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
import Success from "components/Typography/Success.js";
import styles from "styles/styles";
import falconAPI from "falcon-api";

import tableClasses from "styles/table.module.css";

const useStyles = makeStyles(styles);

export default function StockDetails(props) {
    const classes = useStyles();
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const primaryID = params.get('id');

    // State management hooks
    const [currentLocation, setCurrentLocation] = useState([]);
    const [stockHistory, setStockHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        submitted: false,
        messageType: '',
        messageBody: ''
    });

    // Lifecycle hooks
    useEffect(() => {
        setLoading(prevLoading => true);
        falconAPI.post('/stockDetails', { primaryID })
            .then(response => {
                setLoading(prevLoading => false);
                if (response.data.status) {
                    setCurrentLocation(prevCurrentLocation => {
                        return response.data.message.currentData;
                    })
                    setStockHistory(prevStockHistory => {
                        return response.data.message.historyData;
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
            });
    // eslint-disable-next-line
    }, []);

    // Interface pre-processing
    const currentLocationTableBody = (
        <tbody>
            {currentLocation.map((item, id) => {
                return <tr
                    key={id}>
                        <td>{item.delivery_document_id}</td>
                        <td>{item.delivery_document_type}</td>
                        <td>{item.in_stock_for}</td>
                        <td><Link to={props.basePath + '/stock?id=' + item.warehouse_id}>{item.warehouse}</Link></td>
                        <td>{item.date}</td>
                        <td>{item.model}</td>
                        <td>{item.primary_id}</td>
                        <td>{item.secondary_id}</td>
                        <td>{item.price}</td>
                    </tr>
            })}
        </tbody>
    );
    const historyTableBody = (
        <tbody>
            {stockHistory.map((item, id) => {
                return <tr
                    key={id}>
                    <td>{item.delivery_document_id}</td>
                    <td>{item.delivery_document_type}</td>
                    <td>{item.in_stock_for}</td>
                    <td><Link to={props.basePath + '/stock?id=' + item.warehouse_id}>{item.warehouse}</Link></td>
                    <td>{item.date_in}</td>
                    <td>{item.date_out}</td>
                    <td>{item.model}</td>
                    <td>{item.primary_id}</td>
                    <td>{item.secondary_id}</td>
                    <td>{item.price}</td>
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
                        <Success><h3>Current Location</h3></Success>
                        <div className={tableClasses.HelloTable}>
                            <table className={classes.Hello}>
                                <thead>
                                    <tr>
                                        <th>Delivery Document ID</th>
                                        <th>Delivery Document Type</th>
                                        <th>In Stock For</th>
                                        <th>Warehouse</th>
                                        <th>Date</th>
                                        <th>Model</th>
                                        <th>Primary ID</th>
                                        <th>Secondary ID</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                {currentLocationTableBody}
                            </table>
                        </div>
                        <Success><h3>Stock History</h3></Success>
                        <div className={tableClasses.HelloTable}>
                            <table className={classes.Hello}>
                                <thead>
                                    <tr>
                                        <th>Delivery Document ID</th>
                                        <th>Delivery Document Type</th>
                                        <th>In Stock For</th>
                                        <th>Warehouse</th>
                                        <th>Date In</th>
                                        <th>Date Out</th>
                                        <th>Model</th>
                                        <th>Primary ID</th>
                                        <th>Secondary ID</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                {historyTableBody}
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}