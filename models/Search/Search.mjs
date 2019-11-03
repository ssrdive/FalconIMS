import { Pool } from '../../config/mysql';

export const searchItem = (skw, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if(poolErr)
            return callback(poolErr, null);
        connection.query('SELECT MS.delivery_document_id, M.name AS model, W.name as warehouse, MS.primary_id, MS.secondary_id, MS.price, W.id as warehouse_id FROM main_stock MS LEFT JOIN model M ON MS.model_id = M.id LEFT JOIN delivery_document DD ON MS.delivery_document_id = DD.id LEFT JOIN warehouse W ON DD.warehouse_id = W.id WHERE CONCAT(MS.delivery_document_id, M.name, W.name, MS.primary_id, MS.secondary_id) LIKE \'%' + skw + '%\';', (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}

export const searchDocument = (skw, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT DD.id AS delivery_document_id, DDT.name AS delivery_document_type, DD.date, W.id AS to_warehouse_id, W.name AS to_warehouse, FW.id AS from_warehouse_id, FW.name AS from_warehouse, DD.vehicle_no, DD.driver_name FROM delivery_document DD LEFT JOIN delivery_document_type DDT ON DD.delivery_document_type_id = DDT.id LEFT JOIN warehouse W ON DD.warehouse_id = W.id LEFT JOIN warehouse FW ON DD.from_warehouse_id = FW.id WHERE CONCAT(DD.id, DDT.name, DD.date, W.name, FW.name, DD.vehicle_no, DD.driver_name) LIKE \'%' + skw + '%\';', (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}