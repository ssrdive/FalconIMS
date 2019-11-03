import { Pool } from '../../config/mysql';

export const authenticateUser = (username, password, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT U.username FROM user U WHERE U.username = ? AND U.password = ?', [username, password], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, false);

            if (rows.length == 1)
                return callback(err, true)
            else
                return callback(err, false)
        })
    })
}

const getUserAccessLevels = (username, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT AL.name, UA.access_level FROM user_access UA LEFT JOIN access_layer AL ON UA.access_layer_id = AL.id LEFT JOIN user U ON UA.user_id = U.id WHERE U.username = ?', [username], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows)
        })
    })
}

export const getUserByUsername = (username, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT U.* FROM user U WHERE U.username = ?', [username], (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            else {
                getUserAccessLevels(username, (err, accessLayers) => {
                    const user = rows[0];
                    user['accessLevel'] = {};

                    for (let i = 0; i < accessLayers.length; i++)
                        user['accessLevel'][accessLayers[i]['name']] = accessLayers[i]['access_level']

                    return callback(err, user)
                })
            }
        })
    })
}

export const getAccessLevels = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT * FROM access_layer;', (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}

export const addUser = (newUser, accessLevels, callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return callback(err, false);
            }
            connection.query('INSERT INTO user SET ?;', [newUser], (err, results, fields) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        return callback(err, false);
                    })
                }
                accessLevels.map((accessLevel) => {
                    accessLevel.unshift(results.insertId);
                });
                connection.query('INSERT INTO user_access VALUES ?', [accessLevels], (err, result) => {
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
}

export const getAllUsers = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if (poolErr)
            return callback(poolErr, null);
        connection.query('SELECT U.id, U.username, U.name, U.email, GROUP_CONCAT(AL.name) as access_levels FROM user U LEFT JOIN user_access UA ON U.id = UA.user_id LEFT JOIN access_layer AL ON UA.access_layer_id = AL.id GROUP BY U.id, U.username, U.name, U.email;', (err, rows, fields) => {
            connection.release();
            if (err)
                return callback(err, null);
            return callback(err, rows);
        })
    })
}