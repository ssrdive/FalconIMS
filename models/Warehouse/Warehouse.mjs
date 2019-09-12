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

export const createGoodsIn = (deliveryDocument, items, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, false);
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return callback(err, false);
            }
            connection.query('SELECT id FROM delivery_document_type WHERE name=\'Goods In\';', (err, rows, fields) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        return callback(err, false);
                    })
                }
                const deliveryDocumentTypeId = rows[0].id;
                deliveryDocument.delivery_document_type_id = deliveryDocumentTypeId;
                connection.query('INSERT INTO delivery_document SET ?;', [deliveryDocument], (err, results, fields) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            return callback(err, false);
                        })
                    }
                    items.map((item) => {
                        item.unshift(results.insertId);
                    });
                    connection.query('INSERT INTO main_stock (delivery_document_id, model_id, primary_id, secondary_id, price) VALUES ?;', [items], (err, rows, fields) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return callback(err, false);
                            })
                        }
                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    return callback(err, false);
                                })
                            }
                            connection.release();
                            return callback(err, true);
                        })
                    })
                })
            })
        })
    })
}