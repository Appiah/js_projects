const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { LocalStorage } = require('node-localstorage')

const localStorage = new LocalStorage('./data-shows')

const loadShows = () => JSON.parse(localStorage.getItem('shows') || '[]')
const saveShows = shows => localStorage.setItem('shows', JSON.stringify(shows, null, 2))

let PORT = 3092, TAG = '[show.js]'

const app = express()
  .use(cors())
  .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  /*.use(bodyParser.json({
        limit : '50mb'    ///////// LIMIT for JSON
      }));*/
  .put('/release-seats', (req, res) => {
    let show, count, shows = loadShows()
    if(!req.body.showID || !req.body.count) {
      res.status(500)
      return res.json({error: `${TAG} A showID and count are required to release seats`})
    }
    count = parseInt(req.body.count)
    show = shows.find(s => s._id === req.body.showID)
    if(!show){
      res.status(500)
      return res.json({error: `${TAG} Cannot find show with id: ${req.body.showID}`})
    }
    show.reserved -= count
    if(show.reserved < 0){
      show.reserved = 0
    }
    saveShows(shows)
    res.json(show)
  })
  .put('/hold-seats', (req, res) => {
    let show, count, shows = loadShows()
    if(!req.body.showID || !req.body.count){
      res.status(500)
      return res.json({error: `${TAG} A showID and count are required to hold seats`})
    }
    count = parseInt(req.body.count)
    show = shows.find(s => s._id === req.body.showID)
    if(!show){
      res.status(500)
      return res.json({error: `${TAG} Cannot find show with id: ${req.body.showID}`})
    }
    const remainingSeats = show.houseSize - show.reserved
    if(remainingSeats < count){
      res.status(500)
      return res.json({error: `${TAG} Cannot reserve ${count} seats. Only ${remainingSeats} remaining`})
    }
    show.reserved += count
    saveShows(shows)
    res.json(show)
  })
  .get('/show/:id', (req, res) => {
    const shows = loadShows()
    const show = shows.find(show => show._id === req.params.id)
    res.json(show)
    console.log(`${TAG} delivered show ${show.name}`)
  })
  .get('/', (req, res) => {
    const shows = loadShows()
    res.json(shows)
    console.log('shows returned')
  })

  app.listen(PORT, () => console.log(`${TAG} show service running on port ${PORT}`))


  //to hold seats :

  //curl -X PUT http://localhost:3092/hold-seats -d "count=3&showID=84jjfidjfosjfe8rhshf39234"
