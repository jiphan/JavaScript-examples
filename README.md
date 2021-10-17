# express-test

## Project setup
```
npm install
npm run serve
```

## API Endpoints
### /api/{id}
returns msg: {id}
### /api/reddit/{id}
returns top 10 posts from reddit.com/r/{id}

## Other
### logger.js
logs ip address and API endpoint to DynamoDB
### twitter_stream.js
opens connection to Twitter streaming API and writes to Google Sheet

```
$ add {username}
add username to follow
$ read
read current rule ids
$ delete {id}
delete id from follows
$ retry
retry connection if status 429
```
