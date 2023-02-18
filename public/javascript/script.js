

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



