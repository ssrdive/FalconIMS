import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from "components/CustomButtons/Button.js";
import falconAPI from "falcon-api";

import classes from 'components/UI/Input/Input.module.css';

const CatInputs = ({ idx, itemState, handleItemChange, handleItemDelete, setModel }) => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        falconAPI.post('/model/all')
            .then(response => {
                if (response.data.status) {
                    setModels(prevModels => {
                        return response.data.message;
                    })
                    if(response.data.message.length > 0)
                        setModel(idx, response.data.message[0].id);
                } else {
                }
            })
            .catch(error => {
            })
    // eslint-disable-next-line
    }, []);

    return (
        <div key={idx}>
            <label id={classes.InputElement}>Model</label>
            <input
                type="text"
                data-idx={idx}
                id={classes.InputElement}
                className="primaryNumber"
                placeholder="Primary Number"
                value={itemState[idx].primaryNumber}
                onChange={handleItemChange}
            />
            <label id={classes.InputElement}>Secondary Number</label>
            <input
                type="text"
                data-idx={idx}
                id={classes.InputElement}
                className="price"
                placeholder="Price"
                value={itemState[idx].price}
                onChange={handleItemChange}
            />
            <Button id={classes.ShowInline} color='warning'
                onClick={handleItemDelete}>Remove</Button>
        </div>
    );
};
CatInputs.propTypes = {
    idx: PropTypes.number,
    itemState: PropTypes.array,
    handleCatChange: PropTypes.func,
};
export default CatInputs;