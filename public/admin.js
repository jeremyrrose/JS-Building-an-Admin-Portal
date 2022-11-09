// since this div is used in two functions, we'll grab it in the broadest possible scope
const bookContainer = document.querySelector('.book-container')
main()

// the function that runs when the page loads (and again when we want it to)
async function main() {

    // get the whole list of books
    let response = await fetch('http://localhost:3001/listBooks')
    let books = await response.json()

    // clear out the div with the books in it!
    while (bookContainer.children.length) {
        bookContainer.removeChild(bookContainer.children[0])
    }

    // render each book from the response above
    books.forEach(renderBook)
}

// renders each book
// this is basically an HTML template with values filled in from each object
// along with inline event listeners that are hooked up to each specific book.id
function renderBook(book) {

    bookContainer.innerHTML += `
        <div class="row-sm-3">
            <div class="card" style="width: 100%;">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                        Available: 
                        <input id="book-quantity-${book.id}" type="number" value="${book.quantity}"></input>
                        <button type="button" onclick="updateBook(${book.id})">UPDATE</button>
                        <button type="button" onclick="deleteBook(${book.id})">DELETE</button>
                    </h6>
                    <p class="card-text">${book.description}</p>
                </div>
            </div>
        </div>
    `
}

// update a book's quantity (none of the other fields are included)
async function updateBook (bookId) {

    // get the value for the input tied to this specific bookId
    const thisBookInput = document.querySelector(`#book-quantity-${bookId}`)

    // send the update
    const response = await fetch("http://localhost:3001/updateBook", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: bookId,
            quantity: thisBookInput.value
        })
    })

    console.log(await response.json())

}

async function deleteBook (bookId) {

    // send a delete request for the specific bookId
    const response = await fetch(`http://localhost:3001/removeBook/${bookId}`, {
        method: "DELETE"
    })

    console.log(await response.json())

    // re-run the main rendering function
    // this clears out the book div and redraws the current list of books
    main()

}

// grabs values from the form to create the bookInfo object
// this object is the body for the POST request
async function addBook() {
    const bookInfo = {
        title: document.querySelector("#title").value,
        year: document.querySelector("#year").value,
        description: document.querySelector("#description").value,
        quantity: document.querySelector("#quantity").value,
        imageURL: document.querySelector("#imageURL").value,
    }
    const response = await fetch('http://localhost:3001/addBook', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookInfo)
    })
    console.log(await response.json())
    main()
}
