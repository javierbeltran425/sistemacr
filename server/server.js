require('dotenv').config()
const port = process.env.PORT || 3000

const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors())
app.use(express.json())

// MODULES

const auth = require('./modules/auth')

// AUTHENTICATION

app.post('/auth/signup', (req, res) => {
    auth.signup(req, res)
})

app.post('/auth/login', (req, res) => {
    auth.login(req, res)
})

app.listen(port, () => console.log(`Server running on PORT ${port}`))