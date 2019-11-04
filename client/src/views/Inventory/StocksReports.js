import React, { useState, useEffect } from 'react';

import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import Success from "components/Typography/Success.js";
import Info from "components/Typography/Info.js";
import falconAPI from "falcon-api";

import classes from 'components/UI/Input/Input.module.css';

export default function StocksReports(props) {
    // State management hooks
    const [warehouses, setWarehouses] = useState(
        {
            mainStocks: {
                value: 'default',
                options: [
                    { value: 'default', displayValue: 'Default' }
                ]
            },
            authorizedDealers: {
                value: 'default',
                options: [
                    { value: 'default', displayValue: 'Default' }
                ]
            },
            showrooms: {
                value: 'default',
                options: [
                    { value: 'default', displayValue: 'Default' }
                ]
            }
        }
    )

    // Life-cycle hooks
    useEffect(() => {
        falconAPI.post('/warehouse/all')
            .then(response => {
                // setLoading(prevLoading => false);
                if (response.data.status && response.data.message.length > 0) {
                    setWarehouses(prevWarehouses => {
                        const selectValues = response.data.message;
                        const mainStocks = [];
                        const authorizedDealers = [];
                        const showrooms = [];
                        selectValues.map(selectType => {
                            switch (selectType.type) {
                                case 'Main Stock':
                                    mainStocks.push({
                                        value: selectType.id,
                                        displayValue: selectType.name
                                    })
                                    break;
                                case 'Authorized Dealer':
                                    authorizedDealers.push({
                                        value: selectType.id,
                                        displayValue: selectType.name
                                    })
                                    break;
                                case 'Showroom':
                                    showrooms.push({
                                        value: selectType.id,
                                        displayValue: selectType.name
                                    })
                                    break;
                                default:
                                    break;
                            }
                            return null;
                        });
                        const updatedWarehouses = {
                            mainStocks: {
                                value: mainStocks[0].value,
                                options: mainStocks
                            },
                            authorizedDealers: {
                                value: authorizedDealers[0].value,
                                options: authorizedDealers
                            },
                            showrooms: {
                                value: showrooms[0].value,
                                options: showrooms
                            }
                        };
                        return updatedWarehouses;
                    });
                    // setForm(prevForm => {
                    //     const selectValues = response.data.message;
                    //     const updatedSelectValues = []
                    //     selectValues.map(selectType => {
                    //         return updatedSelectValues.push({
                    //             value: selectType.id,
                    //             displayValue: selectType.name
                    //         });
                    //     })
                    //     const updatedForm = {
                    //         ...prevForm,
                    //         [selectName]: {
                    //             ...prevForm[selectName],
                    //             elementConfig: {
                    //                 ...prevForm.elementConfig,
                    //                 options: updatedSelectValues
                    //             },
                    //             value: selectValues[0].id
                    //         }
                    //     };
                    //     return updatedForm;
                    // });
                } else {
                    // if (response.data.message.length > 0)
                    // setSubmitStatus({ submitted: true, messageType: 'error', messageBody: response.data.message });
                    // else
                    // setSubmitStatus({ submitted: true, messageType: 'error', messageBody: 'Prerequired data is not present in the database' });
                }
            })
            .catch(error => {
                // setLoading(prevLoading => false);
                // setSubmitStatus({
                // submitted: true, messageType: 'error', messageBody: 'Error occurred during the API call'
                // });
            });
    }, []);

    const warehouseUpdated = (event, warehouseIdentifier) => {
        const udpatedWarehouses = { ...warehouses };
        const updatedWarehouseElement = { ...udpatedWarehouses[warehouseIdentifier] };
        updatedWarehouseElement.value = event.target.value;
        udpatedWarehouses[warehouseIdentifier] = updatedWarehouseElement;

        setWarehouses(udpatedWarehouses);
    }

    const handleViewStocks = (warehouseIdentifier) => {
        props.history.push('/app/inventory/stock?id=' + warehouses[warehouseIdentifier].value);
    }

    return (
        <React.Fragment>
            <GridItem xs={12} sm={12} md={12}>
                <Info><h4 style={{ margin: '5px 0 5px 0' }}><b>Stocks Reports</b></h4></Info>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
                <Success>Main Stocks</Success>
                <select
                    className={classes.InputElement}
                    onChange={(event) => warehouseUpdated(event, 'mainStocks')}
                >
                    {warehouses.mainStocks.options.map(option => (
                        <option
                            key={option.value}
                            value={option.value}>
                            {option.displayValue}</option>
                    ))}
                </select>
                <Button type='button' color='info' onClick={() => handleViewStocks('mainStocks')}>View Stocks</Button>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
                <Success>Authorized Dealers</Success>
                <select
                    className={classes.InputElement}
                    onChange={(event) => warehouseUpdated(event, 'authorizedDealers')}
                >
                    {warehouses.authorizedDealers.options.map(option => (
                        <option
                            key={option.value}
                            value={option.value}>
                            {option.displayValue}</option>
                    ))}
                </select>
                <Button type='button' color='info' onClick={() => handleViewStocks('authorizedDealers')}>View Stocks</Button>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
                <Success>Showrooms</Success>
                <select
                    className={classes.InputElement}
                    onChange={(event) => warehouseUpdated(event, 'showrooms')}
                >
                    {warehouses.showrooms.options.map(option => (
                        <option
                            key={option.value}
                            value={option.value}>
                            {option.displayValue}</option>
                    ))}
                </select>
                <Button type='button' color='info' onClick={() => handleViewStocks('showrooms')}>View Stocks</Button>
            </GridItem>
        </React.Fragment>
    );
}