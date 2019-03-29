#!/usr/bin/env node

const csv = require("csv")
const fs = require("fs")
const program = require("commander")

let transformer = csv.transform(function(record) {
  if (record.length !== 2) {
    throw {
      type: "RECORDERROR",
      message: "Your csv should have two columns"
    }
  }
  // first record is the header, adds "email" to header
  if (this.started == 1) return [...record, "Email"]
  let identifier
  // initial = first letter of first name + surname
  let initial = `${record[0].slice(0, 1)}${record[1]}`
  let number = 1
  // checks if someone else has the same first initial+surname combo
  while (identifiers.includes((identifier = `${initial}${number}`))) {
    number++
  }
  identifiers.push(identifier)
  let email = identifier + domain
  return [...record, email]
})

let parser = csv.parse({ delimiter: "," })

program
  .description(
    "Create a csv with email addresses for users, requires csv input with a first name column and a last name column"
  )
  .usage("-i <inputFile> -o <outputFile> -d <domain>")
  .option("-i, --input <inputFile>", "input file, must be a csv")
  .option("-d, --domain <domain>", "domain to be added to the generated emails")
  .option(
    "-o, --output <outPutFile>",
    "output file name, default is output.csv"
  )
  .parse(process.argv)

let generationStream
if (!program.input && !program.domain) program.help()
if (!program.input) printUsage("You must specify an input file")
if (!program.domain) printUsage("You must specify a domain")

let domain = program.domain
let input = program.input
let output = program.output || "output.csv"
let identifiers = []

generationStream = fs
  .createReadStream(input)
  .on("error", e => {
    if (e.code === "ENOENT")
      return printUsage(
        "Seems that file doesn't exist, make sure you got the name right"
      )
    return printUsage(e.Error)
  })
  .pipe(parser)
  .on("error", e => {
    return printUsage(
      "seems like there an error with parsing the file, make sure it's a csv file"
    )
  })
  .pipe(transformer)
  .on("error", e => {
    if (e.type && e.type === "RECORDERROR") return printUsage(e.message)
    return printUsage(e)
  })
  .pipe(csv.stringify())
  .pipe(fs.createWriteStream(output))

function printUsage(errorMsg) {
  if (generationStream) generationStream.destroy()
  console.warn("\n" + errorMsg)
  console.log("usage: " + program.name() + " " + program.usage())
  process.exit()
}
