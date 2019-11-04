import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import Input from "components/UI/Input/Input";
import Button from "components/CustomButtons/Button.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Spinner from "components/UI/Spinner/Spinner";
import falconAPI from "falcon-api";
import { useAuth } from "context/auth";

import logo from "assets/img/falcon.png";

export default function Login(props) {
    const { authTokens, setAuthTokens } = useAuth();
    if (authTokens) {
        props.history.push('/app');
    }
    const [form, setForm] = useState({
        username: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Username'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'password',
            elementConfig: {
                type: 'password',
                placeholder: 'Password',
                minLength: 8
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
    const [isLoggedIn, setLoggedIn] = useState(false);

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
        falconAPI.post('/login', {
            username: form.username.value,
            password: form.password.value
        }).then(response => {
            console.log(response);
            setLoading(false);
            setSubmitStatus({
                submitted: true,
                messageType: response.data.status ? 'success' : 'error',
                messageBody: response.data.message
            });
            if (response.data.status) {
                setAuthTokens(Math.random().toString(36).substr(2), response.data.user);
                setLoggedIn(true);
            }
        })
            .catch(error => {
                setLoading(false);
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

    if (isLoggedIn) {
        return <Redirect to="/app" />;
    }

    return (
        <GridContainer>
            <GridItem xs={4} sm={4} md={4}>

            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
                <Card style={{ padding: '20px' }}>
                    <img src={logo} style={{ width: '20%', height: '100px', margin: 'auto', }} alt='Logo' />
                    <h1 style={{ textAlign: 'center', margin: '0' }}>Log In</h1>
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
                    <Button onClick={submitFormHandler}>Log in</Button>
                    <p style={{textAlign: 'center'}}>
                        <span>
                            &copy; {1900 + new Date().getYear()}{" "}
                            <a
                                href="https://falconims.com?ref=mdr-footer"
                            >Falcon IMS</a>
                            , open source inventory management</span>
                    </p>
                </Card>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>

            </GridItem>
        </GridContainer>
    );
}
