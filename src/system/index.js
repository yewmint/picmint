import manager from './manager'
import db from './db'

manager.register(db)

export { manager }