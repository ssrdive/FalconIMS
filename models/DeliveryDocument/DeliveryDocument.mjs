import { Pool } from '../../config/mysql';

export const getAllDocuments = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT DD.id AS delivery_document_id, DDT.name AS delivery_document_type, DD.date, W.id AS to_warehouse_id, W.name AS to_warehouse, FW.id AS from_warehouse_id, FW.name AS from_warehouse, DD.vehicle_no, DD.driver_name FROM delivery_document DD LEFT JOIN delivery_document_type DDT ON DD.delivery_document_type_id = DDT.id LEFT JOIN warehouse W ON DD.warehouse_id = W.id LEFT JOIN warehouse FW ON DD.from_warehouse_id = FW.id ORDER BY DD.date DESC;', (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}