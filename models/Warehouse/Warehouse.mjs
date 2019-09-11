import { Pool } from '../../config/mysql';

export const getWarehouseTypes = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT * FROM warehouse_type;', (err, rows, fields) => {
            connection.release();
            if(err)
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
            if(err)
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
            if(err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}