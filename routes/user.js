var express = require('express');
const { use } = require('../app');
const bookControllers = require('../controller/book-controllers');
const userController = require('../controller/user-controller');
var router = express.Router();

const verifylogin=(req,res,next)=>{
      if(req.session.loggedIn){
            next()
      }else{
            res.redirect('/login')
      }
}


/* GET users listing. */



router.get('/',async function (req, res, next) {
      /*let books=[
               {
                 title:"Nodejs",
                 authorname:"Sam",
                 category:"web development",
                 price:20,
                 image:"https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1639163872l/58293924.jpg"
         
               }
            ]
      */
      let user = req.session.user;
      let cartcount=null
      if(req.session.user){
            cartcount= await userController.getcartcount(req.session.user._id) 
      } 
      bookControllers.getAllBook().then((books) => {
            console.log(user);
          //  console.log(books);
        
            res.render('user/view-books', { books, user,cartcount })
      })


});






router.get('/signup', function (req, res, next) {
      res.render('user/signup')
})




router.post('/signup', (req, res) => {
      console.log(req.body)
      userController.dosignup(req.body).then((response) => {
            console.log(response);
            req.session.loggedIn=true;
            req.session.user=response;
            res.redirect('/')
      })
})





router.get('/login', function (req, res) {
      res.render('user/login')
})
router.post('/login', (req, res) => [
      userController.dologin(req.body).then((response) => {

            if (response.status) {

                  req.session.loggedIn = true
                  req.session.user = response.user
                  res.redirect('/')
            } else {
                  res.redirect('/login')
            }

      })
])

router.get('/logout',(req,res)=>{
      req.session.destroy()
      res.redirect('/')
})

router.get('/cart',verifylogin,async(req, res) => {

      let books = await userController.getCartBooks(req.session.user._id)
      let totalvalue=await userController.getTotalPrice(req.session.user._id)
    console.log(req.body);
      console.log(books)
         
      res.render('user/cart',{books,user:req.session.user,totalvalue})
})




router.get('/add-to-cart/:id',(req, res) => {
      //console.log(req.params.id)
      console.log(req.body)
      console.log("successfully api call")
      userController.addtocart(req.params.id,req.session.user._id).then(() => {
           res.json({status:true})
      })
})
router.post('/change-book-quantity',(req,res,next)=>[
      userController.changeBookQuantity(req.body).then(async(response)=>{
            response.total= await userController.getTotalPrice(req.body.user)
           // console.log(req.body);
            res.json(response)
            
      })
])
router.post('/remove-book',(req,res)=>{
    userController.removeBook(req.body).then(async(response)=>{
     // console.log(req.body)
      res.json(response)
    })
})

router.get('/order',verifylogin,async(req,res)=>{
     let total= await userController.getTotalPrice(req.session.user._id)
      res.render('user/order',{user:req.session.user,total})
})

router.post('/order',async(req,res)=>{

      let books= await userController.getcartBookList(req.body.userId)
      let total= await userController.getTotalPrice(req.body.orderId)
      userController.Order(req.body,books,total).then((response)=>{
            // if(req.body[payment] =='COD'){
                 res.json({status:true})
            // }else{
            //          userController.generateRazorpay(orderId).then((response)=>{

            //          })
            // }
           

      })
      console.log(req.body);
})

router.get('/order-success',(req,res)=>{
      res.render('user/order-success',{user:req.session.user})
})

router.get('/orders',verifylogin,async(req,res)=>{
      let orders=await userController.getuserOrders(req.session.user._id)
      console.log(req.body);
      res.render('user/orders',{user:req.session.user,orders})
})


router.post('/view-order-books/:id',async(req,res)=>{
      let books=await userController.getorderbooks(req.params.id)
      res.render('user/view-order-books',{user:req.session.user,books})
})

router.get('/blog', function (req, res) {
      res.render('user/blog')
})
router.get('/john-book', function (req, res) {
      res.render('user/john-book')
})

module.exports = router;
