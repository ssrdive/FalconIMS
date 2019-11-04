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

export default function Stock(props) {
    const classes = useStyles();
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const modelID = params.get('modelID');
    const days = params.get('days');

    // State management hooks
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        submitted: false,
        messageType: '',
        messageBody: ''
    });

    // Lifecycle hooks
    useEffect(() => {
        setLoading(prevLoading => true);
        falconAPI.post('/agewiseReport', { modelID, days })
            .then(response => {
                setLoading(prevLoading => false);
                if (response.data.status) {
                    setStocks(prevStocks => {
                        return response.data.message;
                    })
                } else {
                    setSubmitStatus({
                        submitted: true, messageType: 'error', messageBody: response.data.message
                    });
                }
            })
            .catch(error => {
                console.log(error)
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
    const tableBody = (
        <tbody>
            {stocks.map((stock, idx) => {
                return <tr
                    key={idx}>
                    <td>{stock.delivery_document_id}</td>
                    <td>{stock.date}</td>
                    <td>{stock.in_stock_for} days</td>
                    <td>{stock.delivery_document_type}</td>
                    <td>{stock.model}</td>
                    <td><Link to={props.basePath + '/stock-details?id=' + stock.primary_id}>{stock.primary_id}</Link></td>
                    <td>{stock.secondary_id}</td>
                    <td>{stock.price}</td>
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
                                        <th>Delivery Document ID</th>
                                        <th>Date</th>
                                        <th>In Stock For</th>
                                        <th>Delivery Document Type</th>
                                        <th>Model</th>
                                        <th>Primary ID</th>
                                        <th>Secondary ID</th>
                                        <th>Price</th>
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