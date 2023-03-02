require('dotenv').config()
const port = process.env.PORT || 3000

const express = require('express')
const app = express()
const knex = require('./db')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

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

// AUTHENTICATION

// signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    
    try {
        const signUp = await knex('users').insert({email: email, hashed_password: hashedPassword})
        
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
        
        res.json({ email, token })
    } catch (err) {
        console.error(err)
        if (err) {
            res.json({ detail: err.detail})
        }
    }
})


// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const users = await knex.select('email', 'hashed_password').from('users').where({email: email})

        if (Object.keys(users).length === 0) return res.json({ detail: 'User does not exist!' })
        
        const success = await bcrypt.compare(password, users[0].hashed_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
        
        if (success) {
            res.json({ 'email' : users[0].email, token})
        } else {
            res.json({ detail: "Login failed"})
        }
    } catch (err) {
        console.error(err)
    }
})

app.listen(port, () => console.log(`Server running on PORT ${port}`))