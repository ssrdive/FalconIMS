import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Success from "components/Typography/Success.js";
import Spinner from "components/UI/Spinner/Spinner";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import falconAPI from "falcon-api";
import Info from "components/Typography/Info.js";

import inputClasses from 'components/UI/Input/Input.module.css';
import tableClasses from "styles/table.module.css";

export default function InventoryTransactions(props) {
    const [searchItemKeyword, setSearchItemKeyword] = useState('');
    const [searchDocumentKeyword, setSearchDocumentKeyword] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        submitted: false,
        messageType: '',
        messageBody: ''
    });

    // Life-cycle hooks
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
    const searchItemInputHandler = (event) => {
        setSearchItemKeyword(event.target.value);
    }

    const searchItemHandler = (event) => {
        event.preventDefault();
        if(searchItemKeyword === '') {
            alert('Enter search keyword');
            return;
        }
        props.history.push({
            pathname: props.basePath + '/itemSearch',
            search: '?skw=' + searchItemKeyword
        })
    }

    const searchDocumentInputHandler = (event) => {
        setSearchDocumentKeyword(event.target.value);
    }

    const searchDocumentHandler = (event) => {
        event.preventDefault();
        if(searchDocumentKeyword === '') {
            alert('Enter search keyword');
            return;
        }
        props.history.push({
            pathname: props.basePath + '/documentSearch',
            search: '?skw=' + searchDocumentKeyword
        })
    }

    const tableBody = (
        <tbody>
            {transactions.map(transaction => {
                return <tr
                    key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.delivery_document_type}</td>
                    <td><Link to={props.basePath + '/stock?id=' + transaction.from_warehouse_id}>{transaction.from_warehouse}</Link></td>
                    <td><Link to={props.basePath + '/stock?id=' + transaction.to_warehouse_id}>{transaction.to_warehouse}</Link></td>
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

    return (
        <React.Fragment>
            <GridItem xs={12} sm={12} md={12}>
                <Info><h4 style={{ margin: '5px 0 5px 0' }}><b>Inventory Transactions</b></h4></Info>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
                <Success>Inventory Transactions</Success>
                <Link to={props.basePath + '/goods-in'}><Button type='button'><b>Goods In</b></Button></Link>
                <Link to={props.basePath + '/goods-out'}><Button type='button'><b>Goods Out</b></Button></Link>
                <Link to={props.basePath + '/goods-transfer'}><Button type='button'><b>Goods Transfer</b></Button></Link>
                <Link to={props.basePath + '/goods-return'}><Button type='button'><b>Goods Return</b></Button></Link>
                <Link to={props.basePath + '/all-documents'}><Button type='button'>All Documents</Button></Link>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
                <Success>Search Item</Success>
                <input value={searchItemKeyword} onChange={searchItemInputHandler} id={inputClasses.InputElement} placeholder='Item Keyword' type='text' />
                <Button type='button' onClick={searchItemHandler}>Search</Button>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
                <Success>Search Document</Success>
                <input value={searchDocumentKeyword} onChange={searchDocumentInputHandler} id={inputClasses.InputElement} placeholder='Document Keyword' type='text' />
                <Button type='button' onClick={searchDocumentHandler}>Search</Button>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
                <br />
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
        </React.Fragment>
    );
}