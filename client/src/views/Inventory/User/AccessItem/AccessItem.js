import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from "components/CustomButtons/Button.js";
import falconAPI from "falcon-api";

import classes from 'components/UI/Input/Input.module.css';

const GoodsInItem = ({ idx, itemState, handleItemChange, handleItemDelete, setModel }) => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        falconAPI.post('/getAccessLevels')
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
                className="accessLevel" >
                {models.map(model => {
                    return (<option key={model.id} value={model.id}>{model.name}</option>);
                })}
            </select>
            <input
                type="text"
                data-idx={idx}
                id={classes.InputElement}
                className="value"
                placeholder="Value"
                value={itemState[idx].primaryNumber}
                onChange={handleItemChange}
            />
            <Button id={classes.ShowInline} color='warning'
                onClick={handleItemDelete}>Remove</Button>
        </div>
    );
};

GoodsInItem.propTypes = {
    idx: PropTypes.number,
    itemState: PropTypes.array,
    handleCatChange: PropTypes.func,
};

export default GoodsInItem;