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