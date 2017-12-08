import { rpc } from '../utils'
import db from './db'

rpc.listen('db-max-id', () => db.maxId())
rpc.listen('db-size', () => db.size())
rpc.listen('db-random', (size) => db.random(size))
rpc.listen('db-search', (words) => db.search(words))
rpc.listen('db-insert', (vals) => db.insert(vals))
rpc.listen('db-update-tags', ({ id, tags }) => db.updateTags(id, tags))
rpc.listen('db-get-img', (id) => db.getImg(id))