import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Success from "components/Typography/Success.js";
import Info from "components/Typography/Info.js";
import styles from "styles/styles";

import tableClasses from "styles/table.module.css";

const useStyles = makeStyles(styles);

export default function InventoryRoot(props) {
    const classes = useStyles();
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const searchInputHandler = (event) => {
        setSearchKeyword(event.target.value);
    }
    const searchHandler = (event) => {
        event.preventDefault();
        props.history.push({
            pathname: props.basePath + '/search',
            search: '?skw=' + searchKeyword
        })
    }
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="success">
                        <h4 className={classes.cardTitleWhite}>{props.title}</h4>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12} sm={6} md={6}>
                                <Success>Inventory Transactions</Success>
                                <Link to={props.basePath + '/goods-in'}><Button type='button'>Goods In</Button></Link>
                                <Link to={props.basePath + '/goods-out'}><Button type='button'>Goods Out</Button></Link>
                                <Link to={props.basePath + '/goods-transfer'}><Button type='button'>Goods Transfer</Button></Link>
                                <Link to={props.basePath + '/goods-return'}><Button type='button'>Goods Return</Button></Link>
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                                <Success>Search Item</Success>
                                <form>
                                    <input value={searchKeyword} onChange={searchInputHandler} style={{ width: '100%' }} type='text' />
                                    <Button type='button' onClick={searchHandler}>Search</Button>
                                </form>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <Success>Recent Transactions</Success>
                                <div className={tableClasses.HelloTable}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Warehouse</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>10314</td>
                                                <td>S.N.P.Traders</td>
                                                <td>2019-09-06 20:25:15</td>
                                            </tr>
                                            <tr>
                                                <td>10313</td>
                                                <td>S.N.P.Traders</td>
                                                <td>2019-09-06 20:25:15</td>
                                            </tr>
                                            <tr>
                                                <td>10314</td>
                                                <td>S.N.P.Traders</td>
                                                <td>2019-09-06 20:25:15</td>
                                            </tr>
                                            <tr>
                                                <td>10314</td>
                                                <td>S.N.P.Traders</td>
                                                <td>2019-09-06 20:25:15</td>
                                            </tr>
                                            <tr>
                                                <td>10314</td>
                                                <td>S.N.P.Traders</td>
                                                <td>2019-09-06 20:25:15</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <Info><b>Administrative Operations</b></Info>
                                <hr />
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                                <Success>Models</Success>
                                <Link to='/app/inventory/model/all'><Button type='button' color='info'>All Models</Button></Link>
                                <Link to='/app/inventory/model/add'><Button type='button' color='info'>Add Model</Button></Link>
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                                <Success>Warehouses</Success>
                                <Link to='/app/inventory/warehouse/all'><Button type='button' color='info'>All Warehouses</Button></Link>
                                <Link to='/app/inventory/warehouse/add'><Button type='button' color='info'>Add Warehouse</Button></Link>
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                                <Success>Regions</Success>
                                <Link to='/app/inventory/region/all'><Button type='button' color='info'>All Regions</Button></Link>
                                <Link to='/app/inventory/region/add'><Button type='button' color='info'>Add Region</Button></Link>
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                                <Success>Territories</Success>
                                <Link to='/app/inventory/territory/all'><Button type='button' color='info'>All Territories</Button></Link>
                                <Link to='/app/inventory/territory/add'><Button type='button' color='info'>Add Territory</Button></Link>
                            </GridItem>
                        </GridContainer>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}