import { Pool } from '../../config/mysql';

export const count = (callback) => {
    Pool.getConnection((poolErr, connection) => {
        if(poolErr)
            return callback(poolErr, null);
        connection.query('SELECT (SELECT COUNT(id) as count FROM delivery_document) as delivery_document_count, (SELECT COUNT(id) as count FROM warehouse) as warehouse_count, (SELECT COUNT(id) as count FROM model) as model_count, (SELECT COUNT(id) as count FROM user) as user_count FROM dual;', (err, rows, fields) => {
            connection.release();
            if(err)
                return callback(err, null);
            return callback(err, rows[0]);
        })
    })
}