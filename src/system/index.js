import manager from './manager'
import db from './db'
import importer from './importer'

manager.register(db)
manager.register(importer)

export { manager }