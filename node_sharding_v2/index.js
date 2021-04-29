const db = require('./db')

db.addCat({name: 'biscuit', color: 'orange'})
db.addCat({name: 'jungle', color: 'black'})
db.addCat({name: 'smokey', color: 'grey'})
db.addCat({name: 'fancy feast', color: 'white'})
db.addCat({name: 'peep', color: 'orange'})
db.addCat({name: 'bread', color: 'orange'})
db.addCat({name: 'monkey', color: 'brown'})
db.addCat({name: '0baby', color: 'white'})
db.addCat({name: 'amberJunior', color: 'ash'})
db.addCat({name: 'andrew', color: 'violet'})
db.addCat({name: 'zigizigi', color: 'green'})

var biscuit = db.findCatByName('biscuit')
var organge_cats = db.findCatsByColor('white')

console.log('biscuit: ', biscuit)
console.log('orange cats: ', organge_cats)
