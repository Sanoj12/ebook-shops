

function addcartcount(bookId) {    //cart button
    $.ajax({
        url: '/add-to-cart/' + bookId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $("#cart-count").html(count)
            }
            alert(response)
        }
    })
}




function changeQuantity(cartId, bookId, userId, count) {     //cart count
    let quantity = parseInt(document.getElementById(bookId).innerHTML)
    count = parseInt(count)
    $.ajax({
        url: '/change-book-quantity',
        data: {
            user: userId,
            cart: cartId,
            book: bookId,
            count: count,
            quantity: quantity
        },
        method: 'post',
        success: ((response) => {
            if (response.removeBook) {

                alert("product removed from cart")
                location.reload()
            } else {


                document.getElementById(bookId).innerHTML = quantity + count
                document.getElementById('total').innerHTML = response.total
            }

        })
    })
}



function removeBook(cartId, bookId) {
    $.ajax({
        url: '/remove-book',
        data: {
            book: bookId,
            cart: cartId,
        },
        method: '/post',
        success: (response) => {
            if (response.removeBook) {
                alert("Book delete successfully")
                location.reload()
            } else {
                document.getElementById(bookId).innerHTML = response.removeBook
            }
        }
    })
}




