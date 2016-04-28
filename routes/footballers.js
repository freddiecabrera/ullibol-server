const express = require('express')
const router = express.Router()
const Redis = require('../RedisDB/redis_config.js').createClient()

router.get('/', (req, res) => {
  res.send('Hello World')
})

router.get('/:footballer', (req, res) => {
  const footballer = req.params.footballer
  Redis.HGETALL(footballer, (err, data) => {
    if (err) { return res.status(400).send('err') }
    else { data ? res.status(200).send(data.footballerData) : res.status(400).send(footballer + ' is not in the DB, please add him') }
  })
})

router.post('/footballer', (req, res) => {
  const keyName = req.body.name.toLowerCase()
  const footballer = req.body.name
  const footballerData = JSON.stringify(req.body)
  Redis.HGETALL(keyName, (err, data) => {
    if (err) { return res.status(400).send(err) }
    else if (data) {
      res.status(200).send(`${footballer} is already in the DB`)
    } else {
      Redis.HMSET(keyName, { footballerData })
      res.status(200).send(`${footballer} is now in the DB`)
    }
  })
})

router.put('/footballer', (req, res) => {
  const keyName = req.body.name.toLowerCase()
  const footballer = req.body.name
  const footballerData = JSON.stringify(req.body)
  Redis.HGETALL(keyName, (err, data) => {
    if (err) { return res.status(400).send(err) }
    else if (data) {
      Redis.HMSET(keyName, { footballerData }, (err, reply) => {
        err ? res.status(400).send(err) : res.status(200).send(`${footballer}'s data has been changed`)
      })
    } else {
      res.status(200).send('Footballer is not in the DB')
    }
  })
})

router.delete('/:footballer', (req, res) => {
  const hash = req.params.footballer;
  Redis.DEL(hash, (err, reply) => {
    if (err) { return res.status(400).send(err)}
    else { reply === 0 ? res.send('Not in the database') : res.send('Deleted') }
  })
})

module.exports = router
