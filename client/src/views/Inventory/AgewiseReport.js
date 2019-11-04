import React, { useState, useEffect } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import Input from "components/UI/Input/Input";
import Button from "components/CustomButtons/Button.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Spinner from "components/UI/Spinner/Spinner";
import styles from "styles/styles";
import falconAPI from "falcon-api";
import Info from "components/Typography/Info.js";

const useStyles = makeStyles(styles);

export default function AgewiseReport(props) {
    const classes = useStyles();
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const modelID = params.get('modelID');
    const days = params.get('days');

    // State management hooks
    const [form, setForm] = useState({
        model: {
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
        days: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Days'
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

    // Life cycle hooks
    useEffect(() => {
        setSelectValues('/model/all', 'model');
    }, []);

    // Functions
    const setSelectValues = (URL, selectName) => {
        setLoading(prevLoading => true);
        falconAPI.post(URL)
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

    const submitFormHandler = () => {
        setLoading(true);
        if (!formIsValid) {
            setLoading(false);
            setSubmitStatus({
                submitted: true,
                messageType: 'error',
                messageBody: 'Validation errors'
            });
            return;
        }
        props.history.push({
            pathname: props.basePath + '/agewiseReport',
            search: '?modelID=' + form.model.value + '&days=' + form.days.value
        })
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
        <React.Fragment>
            <GridItem xs={12} sm={12} md={12}>
                <Info><h4 style={{ margin: '5px 0 5px 0' }}><b>Agewise Reports</b></h4></Info>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
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
                <Button onClick={submitFormHandler}>View Report</Button>
            </GridItem>
        </React.Fragment>

    );
}