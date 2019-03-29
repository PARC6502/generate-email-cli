A node.js cli tool that takes a two-columns csv (first and last name) as input and generates a three column csv (first name, last name, email) as output.

The emails are generated based on a combination of the first and last name and the domain option used with the cli tool

## Usage

```
node generate-email.js -i <inputFile> -o <outputFile> -d <domain>

Create a csv with email addresses for users, requires csv input with a first name column and a last name column

Options:
  -i, --input <inputFile>    input file, must be a csv
  -d, --domain <domain>      domain to be added to the generated emails
  -o, --output <outPutFile>  output file name, default is output.csv
  -h, --help                 output usage information
```

## Example

```bash
node generate-email.js -d @hello.com -i names.csv -o namesWithEmails.csv
```

### Input file

```csv
First name, last name
Valentyna,Ramadan
Samy,Mohamed
Sahar,Mohamed
Nadine,Ozdemir
```

### Output file

```csv
First name, last name,Email
Valentyna,Ramadan,VRamadan1@hello.com
Samy,Mohamed,SMohamed1@hello.com
Sahar,Mohamed,SMohamed2@hello.com
Nadine,Ozdemir,NOzdemir1@hello.com
```
