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