import winston from 'winston'
import { createWriteStream } from 'fs'

// redirect winston to file
winston.add(winston.transports.File, { filename: 'app.log' })
winston.remove(winston.transports.Console)

// redirect stdout to file
let stream = createWriteStream('err.log', { flags: 'a+' })
process.stdout.write = process.stderr.write = stream.write.bind(stream)