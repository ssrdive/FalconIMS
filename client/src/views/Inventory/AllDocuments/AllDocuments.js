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

export default function AllDocuments(props) {
    const classes = useStyles();

    // State management hooks
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        submitted: false,
        messageType: '',
        messageBody: ''
    });

    // Lifecycle hooks
    useEffect(() => {
        setLoading(prevLoading => true);
        falconAPI.post('/getAllDocuments')
            .then(response => {
                setLoading(prevLoading => false);
                if (response.data.status) {
                    setSearchResults(prevSearchResults => {
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
            });
    // eslint-disable-next-line
    }, []);

    // Interface pre-processing
    const tableBody = (
        <tbody>
            {searchResults.map(searchResult => {
                return <tr
                    key={searchResult.delivery_document_id}>
                    <td><Link>{searchResult.delivery_document_id}</Link></td>
                    <td>{searchResult.delivery_document_type}</td>
                    <td>{searchResult.date}</td>
                    <td><Link to={props.basePath + '/stock?id=' + searchResult.from_warehouse_id}>{searchResult.from_warehouse}</Link></td>
                    <td><Link to={props.basePath + '/stock?id=' + searchResult.to_warehouse_id}>{searchResult.to_warehouse}</Link></td>
                    <td>{searchResult.vehicle_no}</td>
                    <td>{searchResult.driver_name}</td>
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
                                        <th>Delivery Document Type</th>
                                        <th>Date</th>
                                        <th>From Warehouse</th>
                                        <th>To Warehouse</th>
                                        <th>Vehilce No</th>
                                        <th>Driver Name</th>
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