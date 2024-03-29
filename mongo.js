const mongoose = require("mongoose")

if (process.argv.length<3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://JoonasKemppainen:${password}@cluster0.nmv4nmc.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", noteSchema)

if (process.argv.length<4) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })    
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
      
  person.save().then(() => {
    console.log("person saved!")
    mongoose.connection.close()
  })
}



