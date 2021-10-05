const moment = require('moment')
const { DynamoDBClient, ListTablesCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb')
const keys = require('../keys.json')

const client = new DynamoDBClient({
    credentials: {
        accessKeyId: keys.aws_id,
        secretAccessKey: keys.aws_secret
    },
    region: 'us-east-2'
})

function logger(req, res, next) {
    let item = {
        ip: req.ip,
        timestamp: moment().format(),
        path: req.originalUrl,
        method: req.method,
        timestamp_unix: moment().unix()
    }
    console.log(item.path, item.ip)

    client.send(new PutItemCommand({
        TableName: 'express-test-log',
        Item: {
            ip: { S: item.ip },
            timestamp_unix: { N: String(item.timestamp_unix) },
            method: { S: item.method },
            path: { S: item.path },
            timestamp: { S: item.timestamp }
        }
    }))

    next()
}

module.exports = logger