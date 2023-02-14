const { Router } = require('express');
var express = require('express');

var bookcontrollers = require('../controller/book-controllers');
var router = express.Router()



router.get('/', function (req, res, next) {

    bookcontrollers.getAllBook().then((books) => {

     console.log(books);
        res.render('admin/book-products', {admin:true,  books })
    })


});
router.get('/add-books', function (req, res, next) {
    res.render('admin/add-books')

})


router.post('/add-books', (req, res) => {

   console.log(req.files.Image);
 bookcontrollers.addBook(req.body,(id)=>{
    let image=req.files.Image;

    
    image.mv('./public/book-images/' +id+'.jpg',(err,done)=>{
        if(!err){
            res.render('admin/add-books')
        }else{
            console.log(err);
        }
    })
 })

   
});



router.get('/delete-book/:id',(req,res)=>{
    let bookId=req.params.id;
    
    console.log(bookId);
    bookcontrollers.deleteBook(bookId).then(()=>{
        res.redirect('/admin')
    })
   
});

router.get('/edit-books/:id',async(req,res)=>{

 
    let books=await bookcontrollers.getBookDetails(req.params.id)
    res.render('admin/edit-books',{books})
})

router.post('/edit-books/:id',(req,res)=>[
    bookcontrollers.updateBook(req.params.id,req.body).then(()=>{
        res.redirect('/admin')
    })

])



module.exports = router;
