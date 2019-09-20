import { Pool } from '../../config/mysql';

export const getSecondaryNumberModelName = (primaryNumber, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, false);
        connection.query('SELECT MS.secondary_id, M.name as model FROM main_stock MS LEFT JOIN model M ON MS.model_id = M.id WHERE MS.primary_id = ? AND sold = 0;', [primaryNumber], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows[0]);
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

export const createInventoryTransaction = (transactionType, deliveryDocument, items, prices, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, false);
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return callback(err, false);
            }
            connection.query('SELECT id FROM delivery_document_type WHERE name = ?;', [transactionType], (err, rows, fields) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        return callback(err, false);
                    })
                }
                const deliveryDocumentTypeId = rows[0].id;
                deliveryDocument.delivery_document_type_id = deliveryDocumentTypeId;
                connection.query('SELECT MS.*, DD.date FROM main_stock MS LEFT JOIN delivery_document DD ON MS.delivery_document_id = DD.id WHERE DD.warehouse_id = ? AND MS.primary_id IN (?) AND sold = 0;', [deliveryDocument.from_warehouse_id, items], (err, rows, fields) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            return callback(err, false);
                        })
                    }
                    if (rows.length != items.length) {
                        err = { code: 'ONE_OR_MORE_INVALID_TRANSFERS' }
                        return connection.rollback(() => {
                            connection.release()
                            callback(err, false)
                        })
                    }
                    const stockHistoryItems = [];
                    const mainStockItems = [];
                    rows.map((row, index) => {
                        stockHistoryItems.push([
                            row.delivery_document_id,
                            row.model_id,
                            row.primary_id,
                            row.secondary_id,
                            row.price,
                            row.date]);
                        mainStockItems.push([
                            row.model_id,
                            row.primary_id,
                            row.secondary_id,
                            prices[index]
                        ]);
                    });
                    stockHistoryItems.map((stockHistoryItem, index) => {
                        stockHistoryItem.push(deliveryDocument.date);
                    });
                    connection.query('INSERT INTO stock_history VALUES ?;', [stockHistoryItems], (err, results) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return callback(err, false);
                            })
                        }
                        connection.query('INSERT INTO delivery_document SET ?;', [deliveryDocument], (err, results) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    return callback(err, false);
                                })
                            }
                            mainStockItems.map((mainStockItem) => {
                                mainStockItem.unshift(results.insertId);
                            });
                            connection.query('DELETE FROM main_stock WHERE primary_id IN (?);', [items], (err, results) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        return callback(err, false);
                                    })
                                }
                                connection.query('INSERT INTO main_stock (delivery_document_id, model_id, primary_id, secondary_id, price) VALUES ?;', [mainStockItems], (err, results) => {
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
            })
        })
    })
}

export const getRecentFiveTransactions = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT DD.id, DDT.name as delivery_document_type, W.name as to_warehouse, W.id as to_warehouse_id, W2.name as from_warehouse, W2.id as from_warehouse_id, date FROM delivery_document DD LEFT JOIN delivery_document_type DDT on DD.delivery_document_type_id = DDT.id LEFT JOIN warehouse W ON DD.warehouse_id = W.id LEFT JOIN warehouse W2 ON DD.from_warehouse_id = W2.id ORDER BY DD.date DESC LIMIT 5 OFFSET 0;', (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}