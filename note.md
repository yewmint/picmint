## import

1. JS: Copy all imgs into `./tmp/pics/[num].jpg`
2. CV: Create thumbnails for all imgs in `./tmp/thumbs/[num].jpg`
3. CV: Extract metas and fingerprint of imgs in `./tmp/infos`
4. JS: Compare fingerprints of imgs
5. JS: NOT-SAME: move into `./store` and register in db
6. JS: SAME: show on screen

notice:
1. new img duplicated with existent img should replace original one
2. new img duplicated with another new img should insert new record

## Store V2

1. if new store, create hash for all pictures
2. if old store, check file path to handle changes
3. forced rehash when requested

`async Store.load()`: load a path as store, watching png and jpg files
`size()`: get size of store
`async search(string)`: search tags
`setTag(hash, tagString)`: set tags for picture

## Picture


