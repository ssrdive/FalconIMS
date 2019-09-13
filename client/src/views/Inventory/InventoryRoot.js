import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Success from "components/Typography/Success.js";
import Info from "components/Typography/Info.js";
import Spinner from "components/UI/Spinner/Spinner";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import styles from "styles/styles";
import falconAPI from "falcon-api";

import inputClasses from 'components/UI/Input/Input.module.css';
import tableClasses from "styles/table.module.css";

const useStyles = makeStyles(styles);

export default function InventoryRoot(props) {
    // State management hooks
    const classes = useStyles();
    const [transactions, setTransactions] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        submitted: false,
        messageType: '',
        messageBody: ''
    });

    // Life cycle hooks
    useEffect(() => {
        setLoading(prevLoading => true);
        falconAPI.post('/getRecentFiveTransactions')
            .then(response => {
                setLoading(prevLoading => false);
                if (response.data.status) {
                    setTransactions(prevModels => {
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
    }, []);

    // Functions
    const searchInputHandler = (event) => {
        setSearchKeyword(event.target.value);
    }

    const searchHandler = (event) => {
        event.preventDefault();
        props.history.push({
            pathname: props.basePath + '/search',
            search: '?skw=' + searchKeyword
        })
    }

    // Interface pre-processing
    const tableBody = (
        <tbody>
            {transactions.map(transaction => {
                return <tr
                    key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.delivery_document_type}</td>
                    <td>{transaction.from_warehouse}</td>
                    <td>{transaction.to_warehouse}</td>
                    <td>{transaction.date}</td>
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
                        <GridContainer>
                            <GridItem xs={12} sm={6} md={6}>
                                <Success>Inventory Transactions</Success>
                                <Link to={props.basePath + '/goods-in'}><Button type='button'>Goods In</Button></Link>
                                <Link to={props.basePath + '/goods-out'}><Button type='button'>Goods Out</Button></Link>
                                <Link to={props.basePath + '/goods-transfer'}><Button type='button'>Goods Transfer</Button></Link>
                                <Link to={props.basePath + '/goods-return'}><Button type='button'>Goods Return</Button></Link>
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                                <Success>Search Item</Success>
                                <form>
                                    <input value={searchKeyword} onChange={searchInputHandler} id={inputClasses.InputElement} type='text' />
                                    <Button type='button' onClick={searchHandler}>Search</Button>
                                </form>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <Success>Recent Transactions</Success>
                                {pageHeader}
                                <div className={tableClasses.HelloTable}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Transaction Type</th>
                                                <th>From Warehouse</th>
                                                <th>To Warehouse</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        {tableBody}
                                    </table>
                                </div>
                                <br />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <Info><b>Administrative Operations</b></Info>
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
                        </GridContainer>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}