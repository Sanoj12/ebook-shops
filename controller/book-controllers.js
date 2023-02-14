var db = require('../config/connection')

var collection = require('../config/collections')
var ObjectId = require('mongodb').ObjectId
module.exports = {
    addBook: (books, callback) => {
        // console.log(books)
        db.get().collection('books').insertOne(books).then((data) => {
            // console.log(data);
            callback(data.insertedId)
        })
        },
            getAllBook: () => {
                return new Promise(async (resolve, reject) => {
                    let books = await db.get().collection(collection.BOOK_COLLECTS).find().toArray()
                    resolve(books)
                })
            },

            deleteBook: (bookId) => {
                return new Promise((resolve, reject) => {
                    db.get().collection(collection.BOOK_COLLECTS).deleteOne({ _id: ObjectId(bookId) }).then((response) => {


                        console.log(ObjectId(bookId));
                        console.log(response);
                        resolve(response)
                    })
                })
            },


            getBookDetails: (bookId) => {
                return new Promise((resolve, reject) => {
                    db.get().collection(collection.BOOK_COLLECTS).findOne({ _id: ObjectId(bookId)}).then((books) => {
                        console.log(books);
                        resolve(books)
                    })

                })
            },


            updateBook: (bookId, bookDetails) => {
                return new Promise((resolve, reject) => {
                    db.get().collection(collection.BOOK_COLLECTS)
                        .updateOne({ _id: ObjectId(bookId) }, {
                            $set: {
                                title: bookDetails.title,
                                authorname: bookDetails.authorname,
                                category: bookDetails.category,
                                price: bookDetails.price
                            }
                        }).then((resolve) => {
                            resolve()
                        })
                })
            }
   
}






