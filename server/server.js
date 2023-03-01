require('dotenv').config()
const port = process.env.PORT || 3000

const express = require('express')
const app = express()
const knex = require('./db')
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.get('/users', async (req, res) => {
    try {
        const users = await knex.select('email').from('users')
        res.json(users)
    } catch (error) {
        console.error(error)
    }
})

app.listen(port, () => console.log(`Server running on PORT ${port}`))