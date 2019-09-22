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
import styles from "styles/styles";
import falconAPI from "falcon-api";

const useStyles = makeStyles(styles);

export default function EditWarehouse(props) {
    const classes = useStyles();
    const warehouseID = props.match.params.id;

    const [form, setForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: true,
            touched: false
        },
        address: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Address'
            },
            value: '',
            validation: {
                required: true
            },
            valid: true,
            touched: false
        },
        telephone: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Telephone'
            },
            value: '',
            validation: {
                required: true,
            },
            valid: true,
            touched: false
        },
    });
    const [formIsValid, setFormIsValid] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        submitted: false,
        messageType: '',
        messageBody: ''
    });
    const [loading, setLoading] = useState(false);

    // Life cycle hooks
    useEffect(() => {
        setLoading(prevLoading => true);
        falconAPI.post('/warehouse/details', { warehouseID })
            .then(response => {
                setLoading(prevLoading => false);
                setForm(prevForm => {
                    const updatedForm = {
                        ...prevForm
                    };
                    updatedForm.name.value = response.data.message.name;
                    updatedForm.address.value = response.data.message.address;
                    updatedForm.telephone.value = response.data.message.telephone;
                    return updatedForm;
                })
            })
            .catch(error => {
                setLoading(prevLoading => false);
                setSubmitStatus({
                    submitted: true, messageType: 'error', messageBody: 'Error occurred during the API call'
                });
            })
    // eslint-disable-next-line
    }, []);

    // Functions
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
                submitted: true, messageType: 'error', messageBody: 'Data not changed'
            });
            return;
        }
        const warehouse = {
            name: form.name.value,
            address: form.address.value,
            telephone: form.telephone.value
        }
        falconAPI.post('/warehouse/edit', { warehouseID, warehouse })
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

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="success">
                        <h4 className={classes.cardTitleWhite}>{props.title}</h4>
                    </CardHeader>
                    <CardBody>
                        {pageHeader}
                        {formElementsArray.map(formElement => (
                            <Input
                                key={formElement.id}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                invalid={!formElement.config.valid}
                                shouldValidate={formElement.config.validation}
                                touched={formElement.config.touched}
                                changed={(event) => inputChangedHandler(event, formElement.id)} />
                        ))}
                        <Button onClick={submitFormHandler}>Update Warehouse</Button>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}