const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { LocalStorage } = require('node-localstorage')

const localStorageShows = new LocalStorage('./data-shows')
const localStorageReservations = new LocalStorage('./data-reservations')

const loadShows = () => JSON.parse(localStorageShows.getItem('shows') || '[]')

const loadReservations = () => JSON.parse(localStorageReservations.getItem('reservations') || '[]')
const saveReservations = reservations => localStorageReservations.setItem('reservations', JSON.stringify(reservations, null, 2))

let PORT = 3093, TAG = '[reservations.js]'

const app = express()
  .use(cors())
  //.use(express.json())
  //.use(express.urlencoded({extended: true}))
  //.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  .use(bodyParser.json())
  /*.use(bodyParser.json({
        limit : '50mb'    ///////// LIMIT for JSON
      }));*/
  .delete('/cancel', (req, res) => {
    const reservations = loadReservations()
    const { showID, name } = req.body
    const reservation = reservations[showID].find(reservation => reservation.name === name)
    reservations[showID] = reservations[showID].filter(reservation => reservation.name !== name)
      saveReservations(reservations)
      res.json({ canceled: true, showID, ... reservation })
  })
  .post('/reserveTickets', (req, res) => {
    const reservations = loadReservations()

    let count, shows = loadShows()

    console.log(`shows : `, shows)

    console.log(`${TAG} /reserveTickets -> req :  `, req.body)
    //console.table(req)
    //console.dir(req, {depth: null, colors: true})

    if(!req.body.name){
      res.status(500)
      return res.json({error: `${TAG} A name is required to reserve tickets.`})
    }

    if(!req.body.count){
      res.status(500)
      return res.json({error: `${TAG} A ticket count is required to reserve tickets.`})
    }

    count = parseInt(req.body.count)
    show = shows.find(shows => shows._id === req.body.showID)//used to be s => s._id

    console.log(`show is equal to : `, show)

    const remainingSeats = show.houseSize - show.reserved
    if(remainingSeats < count){
      res.status(500)
      return res.json({error: `${TAG} cannot reserve ${count} seats. Only ${remainingSeats} remaining.`})
    }

    var list = reservations[req.body.showID]
    var reservation = { name: req.body.name, guests: req.body.count}
    if(!list){
      reservations[req.body.showID] = []
    }
    reservations[req.body.showID].push(reservation)
    show.reserved += count
    saveReservations(reservations)
    res.json({success: true, showID: req.body.showID, ...reservation})
  })
  .get('/reservation/:showID', (req, res) => {
    const reservations = loadReservations()
    res.json(reservations[req.params.showID] || [])
  })
  .get('/', (req, res) => {
    const reservations = loadReservations()
    res.json(reservations)
    console.log(`${TAG} reservations returned`)
  })

  app.listen(PORT, () => console.log(`${TAG} reservations service running on port ${PORT}`))
