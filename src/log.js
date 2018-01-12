import winston from 'winston'

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ 
      filename: 'app.log',
      timestamp: function() {
        return (new Date).toString()
      } 
    })
  ]
})

logger.handleExceptions(
  new winston.transports.File({ filename: 'exceptions.log' })
)