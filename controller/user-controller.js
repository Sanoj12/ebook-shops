var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt');



var ObjectId = require('mongodb').ObjectId
module.exports = {
    dosignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            // if(userData.password==undefined){
            db.get().collection(collection.USER_COLLECTS).insertOne(userData).then((data) => {
                console.log(userData)
                userData._id = data.insertedId
                resolve(userData)
            })
            // }
        })

    },

    dologin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let status = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTS).findOne({ email: userData.email })
            if (user) {

                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login success")
                        response.user = user
                        response.status = true
                        resolve(response)


                    } else {

                        console.log("login failed")
                        resolve({ status: false })

                    }

                })

            } else {
                console.log("login failed")
                resolve({ status: false })
            }
        })
    },

    addtocart: (bookId, userId) => {

        let bookObj = {
            item: ObjectId(bookId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTS).findOne({ user: ObjectId(userId) })
            if (userCart) {
                let bookExist = userCart.books.findIndex(book => book.item == bookId)
                console.log(bookExist)

                if (bookExist !== -1) {
                    db.get().collection(collection.CART_COLLECTS).updateOne({ user: ObjectId(userId), 'books.item': ObjectId(bookId) },

                        {
                            $inc: { 'books.$.quantity': 1 }
                        }
                    ).then(() => {
                        resolve()
                    })
                } else {
                    db.get().collection(collection.CART_COLLECTS).updateOne({ user: ObjectId(userId) },
                        {
                            $push: { books: bookObj }
                        }
                    ).then((response) => {
                        resolve()
                    })

                }

            } else {
                let cartObj = {
                    user: ObjectId(userId),
                    books: [bookObj]
                }
                db.get().collection(collection.CART_COLLECTS).insertOne((cartObj)).then((response) => {
                    resolve(response)
                })
            }

        })
    },
    getCartBooks: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTS).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                },

                {

                    $unwind: '$books'

                },
                {

                    $project: {
                        item: '$books.item',                     //array

                        quantity: '$books.quantity'
                    }

                },
                {
                    $lookup:
                    {
                        from: collection.BOOK_COLLECTS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'book'
                    }

                },
                {
                    $project: {
                        item: 1, quantity: 1, book: { $arrayElemAt: ['$book', 0] }        //array to object
                    }
                }

            ]).toArray()

            resolve(cartItems)
        })
    },

    getcartcount: (userId) => {
        let count = 0
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTS).findOne({ user: ObjectId(userId) })
            if (cart) {
                count = cart.books.length
            }
            resolve(count)
        })
    },
    changeBookQuantity: (data) => {
        data.count = parseInt(data.count)
        data.quantity = parseInt(data.quantity)
        return new Promise((resolve, reject) => {
            if (data.count == -1 && data.quantity == 1) {

                db.get().collection(collection.CART_COLLECTS)
                    .updateOne({ _id: ObjectId(data.cart) },

                        {
                            $pull: { books: { item: ObjectId(data.book) } }
                        }

                    ).then((respone) => {

                        resolve({ removeBook: true })

                    })

            } else {

                db.get().collection(collection.CART_COLLECTS)

                    .updateOne({ _id: ObjectId(data.cart), 'books.item': ObjectId(data.book) },

                        {

                            $inc: { 'books.$.quantity': data.count }

                        }

                    ).then(() => {

                        resolve({status:true})

                    })

            }

        })
    },

    removeBook: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTS)
                .updateOne({ _id: ObjectId(data.cart) },

                    {

                        $pull: { book: { item: ObjectId(data.book) } }

                    }

                ).then((response) => {
                    resolve({ removeBook: true })
                })
        })
    },

    getTotalPrice: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTS).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                },

                {

                    $unwind: '$books'

                },
                {

                    $project: {
                        item: '$books.item',                     //array

                        quantity: '$books.quantity'
                    }

                },
                {
                    $lookup:
                    {
                        from: collection.BOOK_COLLECTS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'book'
                    }

                },
                {
                    $project: {
                        item: 1, quantity: 1, book: { $arrayElemAt: ['$book', 0] }        //array to object
                    }
                },

                {

                    $group: {
                        _id: null,
                        total: {$sum:{ $multiply:[{ $toInt: '$quantity' },{ $toInt: '$book.price' }]} }


                    }         
                }


            ]).toArray()
            console.log(total[0].total)
            resolve(total[0].total)
        })
    }

}


