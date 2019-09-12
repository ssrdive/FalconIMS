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
            <select
                data-idx={idx}
                id={classes.InputElement}
                onChange={handleItemChange}
                className="model" >
                {models.map(model => {
                    return (<option key={model.id} value={model.id}>{model.name}</option>);
                })}
            </select>
            <input
                type="text"
                data-idx={idx}
                id={classes.InputElement}
                className="primaryNumber"
                placeholder="Primary Number"
                value={itemState[idx].primaryNumber}
                onChange={handleItemChange}
            />
            <input
                type="text"
                data-idx={idx}
                id={classes.InputElement}
                className="secondaryNumber"
                placeholder="Secondary Number"
                value={itemState[idx].secondaryNumber}
                onChange={handleItemChange}
            />
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