/**
 * @file log.js
 * @author yewmint
 */

/**
 * setup winston environment
 */

import winston from 'winston'

export const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      filename: 'app.log',
      timestamp: function() {
        return new Date().toString()
      }
    })
  ]
})

logger.handleExceptions(
  new winston.Logger({
    transports: [
      new winston.transports.File({
        filename: 'exception.log',
        timestamp: function() {
          return new Date().toString()
        }
      })
    ]
  })
)
