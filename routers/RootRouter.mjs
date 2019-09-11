import express from 'express';

import { getModels, createModel } from '../models/Model/Model';
import { getWarehouseTypes, createWarehouse, getWarehouses } from '../models/Warehouse/Warehouse';
import { getTerritories, createTerritory } from '../models/Territory/Territory';
import { getRegions, createRegion } from '../models/Region/Region';

const rootRouter = express.Router();

rootRouter.get('/', (req, res) => {
    res.send('Hello');
})

rootRouter.post('/model/all', (req, res) => {
    getModels((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve models data' });
        else
            return res.json({ status: true, message: data });
    });
});

rootRouter.post('/model/add', (req, res) => {
    const { model } = req.body;

    createModel(model, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Model created' });
        else
            return res.json({ status: false, message: 'Failed to create model' });
    });
});

rootRouter.post('/warehouse/add', (req, res) => {
    const { warehouse } = req.body;

    createWarehouse(warehouse, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Warehouse created' });
        else
            return res.json({ status: false, message: 'Failed to create warehouse' });
    });
});

rootRouter.post('/warehouse/all', (req, res) => {
    getWarehouses((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve warehouses data' });
        else
            return res.json({ status: true, message: data });
    });
});

rootRouter.post('/warehouse/type/all', (req, res) => {
    getWarehouseTypes((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve warehouse types data' });
        else
            return res.json({ status: true, message: data });
    });
});

rootRouter.post('/territory/all', (req, res) => {
    getTerritories((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve territories data' });
        else
            return res.json({ status: true, message: data });
    });
});

rootRouter.post('/territory/add', (req, res) => {
    const { territory } = req.body;

    createTerritory(territory, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Territory created' });
        else
            return res.json({ status: false, message: 'Failed to create territory' });
    });
});

rootRouter.post('/region/all', (req, res) => {
    getRegions((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve regions data' });
        else
            return res.json({ status: true, message: data });
    });
});

rootRouter.post('/region/add', (req, res) => {
    const { region } = req.body;

    createRegion(region, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Region created' });
        else
            return res.json({ status: false, message: 'Failed to create region' });
    });
});

export default rootRouter;