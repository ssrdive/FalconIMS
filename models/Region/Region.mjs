import { Pool } from '../../config/mysql';

export const getRegions = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT * FROM region;', (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}

export const createRegion = (region, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('INSERT INTO region SET ?;', [region], (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, false);
            return callback(err, true);
        })
    })
}