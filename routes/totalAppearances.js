const express = require('express')
const router = express.Router()
const Redis = require('../RedisDB/redis_config.js').createClient()

router.get('/', (req, res) => {
  res.send('hello world')
})

router.get('/:totalPlayerAppearances', (req, res) => {
  const keyName = req.params.totalPlayerAppearances
  Redis.HGETALL(keyName, (err, data) => {
    if (err) { res.status(400).send(err) }
    else { data ? res.status(200).send(data.playerData) : res.status(200).send(`${keyName} data is not in the DB`) }
  })
})

router.post('/totalPlayerAppearances', (req, res) => {
  const footballer = req.body.keyName
  const keyName = `${req.body.keyName}'s total appearances`.toLowerCase()
  const playerData = JSON.stringify(req.body)
  Redis.HGETALL(keyName, (err, data) => {
    if (err) { return res.status(400).send(err) }
    else if (data) {
      res.status(400).send(`${footballer}'s total appearances have already been submitted`)
    } else {
      Redis.HMSET(keyName, { playerData }, (err, reply) => {
        err ? res.stadtus(400).send(err) : res.status(200).send(`${footballer}'s total appearance data has been successfully submitted`)
      })
    }
  })
})

// router.put('/totalPlayerAppearances', (req, res) => {
//
// })

// router.put()
// route.delet()

module.exports = router
