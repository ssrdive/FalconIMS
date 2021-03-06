import { Pool } from '../../config/mysql';

export const getTerritories = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT T.*, R.name as region FROM territory T LEFT JOIN region R on T.region_id = R.id;', (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}

export const createTerritory = (territory, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('INSERT INTO territory SET ?;', [territory], (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, false);
            return callback(err, true);
        })
    })
}