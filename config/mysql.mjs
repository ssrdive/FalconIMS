import mysql from 'mysql';

export const Pool = mysql.createPool({
    host            :   '206.189.157.72',
    user            :   'root',
    multipleStatements: true,
    password        :   'falcon@123',
    timezone        :   'UTC',
    database        :   'falcon',
    dateStrings     :   'date',
    supportBigNumbers: true,
    bigNumberStrings: true
});