require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")


app.use(express.json())
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"), "-",
      tokens["response-time"](req, res), "ms",
      JSON.stringify(req.body)
    ].join(" ")
  })
)

app.use(cors())
app.use(express.static("build"))

app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>")
})

app.get("/info", (req, res, next) => {
  Person.countDocuments({}).then(count => {
    const date = new Date()
    res.send(
      `<p>Phonebook has info for ${count} people</p>
            <p>${date}</p>`
    )
  }).catch(error => next(error))
})

app.get("/api/people", (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get("/api/people/:id", (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    } 
  }).catch(error => next(error))
})

app.post("/api/people", (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
    
  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

app.delete("/api/people/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put("/api/people/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { 
    new: true,
    runValidators: true, 
  })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
