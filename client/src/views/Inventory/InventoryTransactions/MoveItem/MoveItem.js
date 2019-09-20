import React from 'react';
import PropTypes from 'prop-types';

import Button from "components/CustomButtons/Button.js";

import classes from 'components/UI/Input/Input.module.css';

const MoveItem = ({ idx, itemState, handleItemChange, handleItemDelete, handleEnterPressed }) => {

    return (
        <div key={idx}>
            <label id={classes.InputElement} style={{color: 'green'}}>{itemState[idx].model}</label>
            <input
                type="text"
                data-idx={idx}
                id={classes.InputElement}
                className="primaryNumber"
                placeholder="Primary Number"
                value={itemState[idx].primaryNumber}
                onChange={handleItemChange}
                onKeyDown={handleEnterPressed}
            />
            <label id={classes.InputElement} style={{color: 'green'}}>{itemState[idx].secondaryNumber}</label>
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

MoveItem.propTypes = {
    idx: PropTypes.number,
    itemState: PropTypes.array,
    handleCatChange: PropTypes.func,
};

export default MoveItem;