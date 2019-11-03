import { Pool } from '../../config/mysql';

export const getModels = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT * FROM model;', (err, rows, fields) => {
            connection.release();
            if (err)
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
            if (err)
                return callback(err, false);
            return callback(err, true);
        })
    })
}

export const getModelDetails = (modelID, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT M.name, M.country, M.primary_name, M.secondary_name FROM model M WHERE M.id = ?', [modelID], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows[0]);
        })
    })
}

export const editModel = (modelID, model, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, false);
        connection.query('UPDATE model SET ? WHERE id = ?;', [model, modelID], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, false);
            return callback(err, true);
        })
    })
}