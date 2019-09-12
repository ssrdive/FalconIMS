import React from 'react';

import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import styles from "styles/styles";

const useStyles = makeStyles(styles);

export default function GoodsTransfer(props) {
    const classes = useStyles();
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const skw = params.get('skw');
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="success">
                        <h4 className={classes.cardTitleWhite}>{props.title}</h4>
                    </CardHeader>
                    <CardBody>
                        {skw}
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}