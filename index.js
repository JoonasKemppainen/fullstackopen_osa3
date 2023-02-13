const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors")

app.use(express.json());
app.use(bodyParser.json());
app.use(
    morgan(function (tokens, req, res) {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
      ].join(' ')
    })
  )

app.use(cors())


const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(person => person.id))
        : 0
    return maxId + 1
}

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
  ]

app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>")
})

app.get("/info", (req, res) => {
    const count = persons.length
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${count} people</p>
        <p>${date}</p>`
    )
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
  })

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        res.status(404).end()
    } else {
        res.json(person)
    }   
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: "name is missing"
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: "number is missing"
        })
    } else if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({
            error: "name already on the list"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})