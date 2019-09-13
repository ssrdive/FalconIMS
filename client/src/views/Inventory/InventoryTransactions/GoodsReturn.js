import React, { useState, useEffect } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Input from "components/UI/Input/Input";
import Button from "components/CustomButtons/Button.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Spinner from "components/UI/Spinner/Spinner";
import MoveItem from "views/Inventory/InventoryTransactions/MoveItem/MoveItem";
import styles from "styles/styles";
import falconAPI from "falcon-api";

const useStyles = makeStyles(styles);

export default function GoodsReturn(props) {
    const classes = useStyles();

    // State management hooks
    const [form, setForm] = useState({
        goodsFromWarehouse: {
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'default', displayValue: 'Default' }
                ]
            },
            value: 'default',
            validation: {},
            valid: true
        },
        mainStock: {
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'default', displayValue: 'Default' }
                ]
            },
            value: 'default',
            validation: {},
            valid: true
        },
        vehicleNo: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Vehicle Number'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        driverName: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Driver Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        driverTelephone: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Driver Telephone'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        }
    });
    const [formIsValid, setFormIsValid] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        submitted: false,
        messageType: '',
        messageBody: ''
    });
    const [loading, setLoading] = useState(false);
    const blankItem = { model: 'Model', primaryNumber: '', secondaryNumber: 'Primary Number', price: '' };
    const [itemState, setItemState] = useState([
        { model: 'Model', primaryNumber: '', secondaryNumber: 'Primary Number', price: '' }
    ]);

    // Life cycle hooks
    useEffect(() => {
        setSelectValues('/warehouse/bytype/all', { warehouseTypes: ['Main Stock'] }, 'mainStock');
        setSelectValues('/warehouse/bytype/all', { warehouseTypes: ['Authorized Dealer', 'Showroom'] }, 'goodsFromWarehouse');
    }, []);

    // Functions
    const setSelectValues = (URL, params, selectName) => {
        setLoading(prevLoading => true);
        falconAPI.post(URL, params)
            .then(response => {
                setLoading(prevLoading => false);
                if (response.data.status && response.data.message.length > 0) {
                    setForm(prevForm => {
                        const selectValues = response.data.message;
                        const updatedSelectValues = []
                        selectValues.map(selectType => {
                            return updatedSelectValues.push({
                                value: selectType.id,
                                displayValue: selectType.name
                            });
                        })
                        const updatedForm = {
                            ...prevForm,
                            [selectName]: {
                                ...prevForm[selectName],
                                elementConfig: {
                                    ...prevForm.elementConfig,
                                    options: updatedSelectValues
                                },
                                value: selectValues[0].id
                            }
                        };
                        return updatedForm;
                    });
                } else {
                    if (response.data.message.length > 0)
                        setSubmitStatus({ submitted: true, messageType: 'error', messageBody: response.data.message });
                    else
                        setSubmitStatus({ submitted: true, messageType: 'error', messageBody: 'Prerequired data is not present in the database' });
                }
            })
            .catch(error => {
                setLoading(prevLoading => false);
                setSubmitStatus({
                    submitted: true, messageType: 'error', messageBody: 'Error occurred during the API call'
                });
            });
    }

    const checkValidity = (value, rules) => {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.minLength && isValid;
        }

        return isValid;
    }

    const inputChangedHandler = (event, inputIdentifier) => {
        const updatedForm = { ...form };
        const updatedFormElement = { ...updatedForm[inputIdentifier] };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        // eslint-disable-next-line
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }
        setForm(updatedForm);
        setFormIsValid(formIsValid);
    }

    const submitFormHandler = (e) => {
        setLoading(prevLoading => true);
        if (!formIsValid) {
            setLoading(prevLoading => false);
            setSubmitStatus({
                submitted: true, messageType: 'error', messageBody: 'Validation errors'
            });
            return;
        }
        const deliveryDocument = {
            warehouse_id: form.mainStock.value,
            from_warehouse_id: form.goodsFromWarehouse.value,
            vehicle_no: form.vehicleNo.value,
            driver_name: form.driverName.value,
            driver_telephone: form.driverTelephone.value
        }
        const items = [];
        const prices = [];
        // eslint-disable-next-line
        itemState.map((itm) => {
            items.push([itm.primaryNumber]);
            prices.push([itm.price]);
        });
        falconAPI.post('/inventoryTransaction/add', { transactionType: 'Goods Return', deliveryDocument, items, prices })
            .then(response => {
                setLoading(prevLoading => false);
                setSubmitStatus({
                    submitted: true,
                    messageType: response.data.status ? 'success' : 'error',
                    messageBody: response.data.message
                })
            })
            .catch(error => {
                setLoading(prevLoading => false);
                setSubmitStatus({
                    submitted: true,
                    messageType: 'error',
                    messageBody: 'Error occurred in during the API call'
                })
            });
    }

    const handleItemChange = (e) => {
        const updatedItems = [...itemState];
        updatedItems[e.target.dataset.idx][e.target.className] = e.target.value;
        setItemState(updatedItems);
    }

    const handleItemDelete = (e, idx) => {
        e.preventDefault();
        const updatedItems = [...itemState];
        updatedItems.splice(idx, 1);
        setItemState(updatedItems);
    }

    const addItem = () => {
        setItemState([...itemState, { ...blankItem }]);
    }

    const handleEnterPressed = (e, idx) => {
        if (e.keyCode === 13) {
            setPrimaryNumberModelHandler(idx, 'Loading...', 'Loading...');
            falconAPI.post('/getSecondaryNumberModelName', { primaryNumber: itemState[idx].primaryNumber })
                .then(response => {
                    const { secondaryNumber, model } = response.data.message;
                    setPrimaryNumberModelHandler(idx, secondaryNumber, model);
                })
                .catch(error => {
                    setPrimaryNumberModelHandler(idx, 'Error', 'Error');
                })
        }
    }

    const setPrimaryNumberModelHandler = (idx, primaryNumber, model) => {
        const updatedItems = [...itemState];
        updatedItems[idx].secondaryNumber = primaryNumber;
        updatedItems[idx].model = model;
        setItemState(prevItemState => updatedItems);
    }

    // Interface pre-processing
    const formElementsArray = [];
    // eslint-disable-next-line
    for (let key in form) {
        formElementsArray.push({
            id: key,
            config: form[key]
        })
    }

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

    // Final render
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="success">
                        <h4 className={classes.cardTitleWhite}>{props.title}</h4>
                    </CardHeader>
                    <CardBody>
                        {pageHeader}
                        <GridContainer>
                            {formElementsArray.map(formElement => (
                                <GridItem key={formElement.id} xs={12} sm={6} md={6}>
                                    <Input
                                        elementType={formElement.config.elementType}
                                        elementConfig={formElement.config.elementConfig}
                                        value={formElement.config.value}
                                        invalid={!formElement.config.valid}
                                        shouldValidate={formElement.config.validation}
                                        touched={formElement.config.touched}
                                        changed={(event) => inputChangedHandler(event, formElement.id)} />
                                </GridItem>
                            ))}
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <Button color='info' onClick={addItem}>Add Item</Button>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            {
                                itemState.map((val, idx) => {
                                    return (
                                        <GridItem key={idx} xs={12} sm={12} md={12}>
                                            <MoveItem
                                                idx={idx}
                                                itemState={itemState}
                                                handleItemChange={handleItemChange}
                                                handleEnterPressed={(e) => handleEnterPressed(e, idx)}
                                                handleItemDelete={(e) => handleItemDelete(e, idx)}
                                            />
                                        </GridItem>
                                    );
                                })
                            }
                        </GridContainer>
                        <Button onClick={submitFormHandler}>Issue Goods In</Button>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}