import { Pool } from '../../config/mysql';

export const getModels = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT * FROM model;', (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}

export const createModel = (model, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('INSERT INTO model SET ?;', [model], (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, false);
            return callback(err, true);
        })
    })
}