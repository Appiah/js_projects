const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require('node-fetch')

let PORT_main = 3087, PORT_show = 3092, PORT_resrv = 3093, TAG = `[api.js]`



const getAllShows = () =>
fetch(`http://localhost:`+PORT_show)
  .then(res => res.json())

const getShow = id =>
fetch(`http://localhost:`+PORT_show+`/show/${id}`)
  .then(res => res.json())

const holdSeats = (showID, count) =>
fetch(`http://localhost:`+PORT_show+`/hold-seats`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({count, showID})
}).then(res => res.json())

const makeReservation = (name, count, showID) =>
  fetch(`http://localhost:`+PORT_resrv+`/reserveTickets`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name, count, showID})
  }).then(res => res.json())

  const app = express()
    .use(cors())
    .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    //.use(express.json())
    //.use(express.urlencoded())
    .post('/reserve', async(req, res) => {

      let count, show

      console.log(`${TAG} /reserve -> req :  `, req.body)

      if(!req.body.count){
        res.status(500)
        return res.json({error: `${TAG} A ticket count is required to reserve tickets.`})
      }

      if(!req.body.name){
        res.status(500)
        return res.json({error: `${TAG} A name is required to reserve tickets.`})
      }

      //Parse the count
      count = parseInt(req.body.count)

      //Lookup the Show
      show = await getShow(req.body.showID)

      if(!show){
        res.status(500)
        return res.json({error: `${TAG} Cannot find show with id: ${req.body.showID}`})
      }

      const remainingSeats = show.houseSize - show.reserved

      if(remainingSeats < count){
        res.status(500)
        return res.json({error: `${TAG} cannot reserve ${count} seats. Only ${remainingSeats} remaining`})
      }

      //Hold seats with show Service
      console.log(`holding ${count} seats for ${req.body.name}`)
      await holdSeats(req.body.showID, count)

      //Make Reservation Service
      console.log(`making the reservation for ${req.body.name}`)
      console.log(`${TAG} Request to be sent to reservations : `, req)
      const reservation = await makeReservation( req.body.name, count, req.body.showID )

      res.json({success: true, showID: req.body.showID, ...reservation})

    })
    .get('/', async(req, res) => {
        //Return a List of Shows Only
        console.log(`${TAG} requesting shows from show service`)
        var shows = await getAllShows()
        res.json(shows)
    })

app.listen(PORT_main, () => console.log(`${TAG} Show Ticket API running for all clients`))


/*
The underlying benifit of orchestration is the security it offers.
We can decide to only show the services we want to expose.
*/
