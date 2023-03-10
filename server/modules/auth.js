const knex = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async function (req, res) {
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
}

const login = async function (req, res) {
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
}

module.exports = { signup , login };