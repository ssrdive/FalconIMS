import express from 'express';

import { getDateTime } from '../functions/MDate';

import {
    createGoodsIn,
    createInventoryTransaction,
    getRecentFiveTransactions,
    getSecondaryNumberModelName
} from '../models/InventoryTransaction/InventoryTransaction';
import { getModels, createModel } from '../models/Model/Model';
import {
    getWarehouseTypes,
    createWarehouse,
    getWarehouses,
    getWarehousesByTypes,
    getWarehouseStock,
    getWarehouseName
} from '../models/Warehouse/Warehouse';
import { getTerritories, createTerritory } from '../models/Territory/Territory';
import { getRegions, createRegion } from '../models/Region/Region';
import { searchItem } from '../models/Search/Search';
import { count } from '../models/Count/Count';

const RootRouter = express.Router();

RootRouter.get('/', (req, res) => {
    res.send('api.falconims.com');
})

RootRouter.post('/goodsIn/add', (req, res) => {
    const { deliveryDocument, items } = req.body;

    deliveryDocument.date = getDateTime();
    deliveryDocument.issuer = 'SYSTEM';

    createGoodsIn(deliveryDocument, items, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Goods in issued' });
        else
            return res.json({ status: false, message: 'Failed to issue goods in. Error:' + err.code });
    })
});

RootRouter.post('/inventoryTransaction/add', (req, res) => {
    const { transactionType, deliveryDocument, items, prices } = req.body;

    deliveryDocument.date = getDateTime();
    deliveryDocument.issuer = 'SYSTEM';

    createInventoryTransaction(transactionType, deliveryDocument, items, prices, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Inventory transaction issued' });
        else
            return res.json({ status: false, message: 'Failed to issue inventory trasaction. Error:' + err.code });
    })
});

RootRouter.post('/getRecentFiveTransactions', (req, res) => {
    getRecentFiveTransactions((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve recent transactions' });
        else
            return res.json({ status: true, message: data });
    });
});

RootRouter.post('/getSecondaryNumberModelName', (req, res) => {
    const { primaryNumber } = req.body;

    getSecondaryNumberModelName(primaryNumber, (err, data) => {
        const response = { secondaryNumber: 'N/A', model: 'N/A' };
        if (err)
            return res.json({ status: true, message: response });
        else {
            if (data !== undefined) {
                response.secondaryNumber = data.secondary_id;
                response.model = data.model;
            }
            return res.json({ status: true, message: response });
        }
    })
});

RootRouter.post('/searchItem', (req, res) => {
    const { skw } = req.body;

    searchItem(skw, (err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve search results' });
        else
            return res.json({ status: true, message: data });
    })
})

RootRouter.post('/count', (req, res) => {
    count((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve count data' });
        else
            return res.json({ status: true, message: data});
    })
})

RootRouter.post('/model/all', (req, res) => {
    getModels((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve models data' });
        else
            return res.json({ status: true, message: data });
    });
});

RootRouter.post('/model/add', (req, res) => {
    const { model } = req.body;

    createModel(model, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Model created' });
        else
            return res.json({ status: false, message: 'Failed to create model' });
    });
});

RootRouter.post('/warehouse/add', (req, res) => {
    const { warehouse } = req.body;

    createWarehouse(warehouse, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Warehouse created' });
        else
            return res.json({ status: false, message: 'Failed to create warehouse' });
    });
});

RootRouter.post('/warehouse/all', (req, res) => {
    getWarehouses((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve warehouses data' });
        else
            return res.json({ status: true, message: data });
    });
});

RootRouter.post('/warehouse/type/all', (req, res) => {
    getWarehouseTypes((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve warehouse types data' });
        else
            return res.json({ status: true, message: data });
    });
});

RootRouter.post('/warehouse/bytype/all', (req, res) => {
    const { warehouseTypes } = req.body;

    getWarehousesByTypes(warehouseTypes, (err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve warehouses data' });
        else
            return res.json({ status: true, message: data });
    })
})

RootRouter.post('/warehouse/stock', (req, res) => {
    const { warehouseID } = req.body;

    getWarehouseStock(warehouseID, (err, data) => { 
        if (err)
            return res.json({ status: false, message: 'Failed retrieve warehouse stock data' });
        else
            return res.json({ status: true, message: data });
    })
})

RootRouter.post('/warehouse/name', (req, res) => {
    const { warehouseID } = req.body;

    getWarehouseName(warehouseID, (err, data) => { 
        if (err)
            return res.json({ status: false, message: 'Failed retrieve warehouse name' });
        else
            return res.json({ status: true, message: data });
    })
})

RootRouter.post('/territory/all', (req, res) => {
    getTerritories((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve territories data' });
        else
            return res.json({ status: true, message: data });
    });
});

RootRouter.post('/territory/add', (req, res) => {
    const { territory } = req.body;

    createTerritory(territory, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Territory created' });
        else
            return res.json({ status: false, message: 'Failed to create territory' });
    });
});

RootRouter.post('/region/all', (req, res) => {
    getRegions((err, data) => {
        if (err)
            return res.json({ status: false, message: 'Failed to retrieve regions data' });
        else
            return res.json({ status: true, message: data });
    });
});

RootRouter.post('/region/add', (req, res) => {
    const { region } = req.body;

    createRegion(region, (err, created) => {
        if (created)
            return res.json({ status: true, message: 'Region created' });
        else
            return res.json({ status: false, message: 'Failed to create region' });
    });
});

export default RootRouter;