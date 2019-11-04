import { Pool } from '../../config/mysql';

export const getWarehouseTypes = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT * FROM warehouse_type;', (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}

export const createWarehouse = (warehouse, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('INSERT INTO warehouse SET ?;', [warehouse], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, false);
            return callback(err, true);
        })
    })
}

export const editWarehouse = (warehouseID, warehouse, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, false);
        connection.query('UPDATE warehouse SET ? WHERE id = ?;', [warehouse, warehouseID], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, false);
            return callback(err, true);
        })
    })
}

export const getWarehouseDetails = (warehouseID, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT W.name, W.address, W.telephone FROM warehouse W WHERE W.id = ?', [warehouseID], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows[0]);
        })
    })
}

export const getWarehouses = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT W.*, WT.name as type, T.name as territory FROM warehouse W LEFT JOIN warehouse_type WT ON W.warehouse_type_id = WT.id LEFT JOIN territory T ON W.territory_id = T.id;', (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}

export const getWarehousesByTypes = (warehouseTypes, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, false)
        connection.beginTransaction((err) => {
            if (err) {
                connection.release()
                return callback(err, false)
            }
            connection.query('SELECT id FROM warehouse_type WHERE name IN (?);', [warehouseTypes], (err, rows, fields) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release()
                        callback(err, false)
                    })
                }
                const warehouseTypesArr = [];
                rows.map(row => {
                    warehouseTypesArr.push(row.id);
                });
                connection.query('SELECT id, name FROM warehouse WHERE warehouse_type_id IN (?);', [warehouseTypesArr], (err, rows, fields) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release()
                            callback(err, false)
                        })
                    }
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release()
                                callback(err, false)
                            })
                        }
                        connection.release()
                        callback(err, rows);
                    })
                })
            })
        })
    })
}

export const getWarehouseStock = (warehouseID, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT MS.delivery_document_id, MS.primary_id, MS.secondary_id, DATEDIFF(NOW(), DD.date) as in_stock_for, MS.price, M.name as model, DD.date, DDT.name as delivery_document_type FROM main_stock MS LEFT JOIN model M  ON MS.model_id = M.id LEFT JOIN delivery_document DD ON MS.delivery_document_id = DD.id LEFT JOIN delivery_document_type DDT ON DD.delivery_document_type_id = DDT.id WHERE DD.warehouse_id = ? AND sold = 0;', [warehouseID], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}

export const getWarehouseName = (warehouseID, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null)
        connection.query('SELECT name, address FROM warehouse WHERE id = ?', [warehouseID], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows[0]);
        })
    })
}

const getRegionNameByID = (region, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null)
        connection.query('SELECT name FROM region WHERE id = ?', [region], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows[0]);
        })
    })
}

const getTerritoryNameByID = (territory, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null)
        connection.query('SELECT name FROM territory WHERE id = ?', [territory], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows[0]);
        })
    })
}

export const getWarehousesByLocale = (region, territory, callback) => {
    getRegionNameByID(region, (err, regionData) => {
        getTerritoryNameByID(territory, (err, territoryData) => {
            Pool.getConnection((poolErr, connection) => {
                if (poolErr)
                    return callback(poolErr, null)

                if (regionData.name == 'Direct') {
                    connection.query('SELECT W.id, W.name FROM warehouse W', (err, rows, fields) => {
                        connection.release();
                        if (err)
                            return callback(err, null);
                        return callback(err, rows);
                    })
                } else {
                    if (territoryData.name == 'Direct') {
                        connection.query('SELECT W.id, W.name FROM warehouse W LEFT JOIN territory T ON W.territory_id = T.id WHERE T.region_id = ?', [region], (err, rows, fields) => {
                            connection.release();
                            if (err)
                                return callback(err, null);
                            return callback(err, rows);
                        })
                    } else {
                        connection.query('SELECT W.id, W.name FROM warehouse W LEFT JOIN territory T ON W.territory_id = T.id WHERE T.region_id = ? AND W.territory_id = ?', [region, territory], (err, rows, fields) => {
                            connection.release();
                            if (err)
                                return callback(err, null);
                            return callback(err, rows);
                        })
                    }
                }
            })
        })
    })
}

export const getStocksByAge = (modelID, days, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT MS.delivery_document_id, MS.primary_id, MS.secondary_id, DATEDIFF(NOW(), DD.date) as in_stock_for, MS.price, M.name as model, DD.date, DDT.name as delivery_document_type FROM main_stock MS LEFT JOIN model M  ON MS.model_id = M.id LEFT JOIN delivery_document DD ON MS.delivery_document_id = DD.id LEFT JOIN delivery_document_type DDT ON DD.delivery_document_type_id = DDT.id WHERE DATEDIFF(NOW(), DD.date) >= ? AND MS.model_id = ? AND sold = 0;', [days, modelID], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}