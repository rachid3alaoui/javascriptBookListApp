// Book class

console.log(localStorage);


class Book {
    constructor(title,author,isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class : Handle UI Tasks

class UI {
    static displayBooks() {
        // const StoredBooks = [
        //     {
        //         title : "Book One",
        //         author : 'John Doe',
        //         isbn : '409803'
        //     },
        //     {
        //         title : 'Book Two',
        //         author : 'Jane Doe',
        //         isbn : '23090'
        //     }
        // ];

        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            alert("Are you sure ?");
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className =`alert alert-${className} text-center`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#form-book');
        container.insertBefore(div,form);
        // Vanish after 3 seconds
        setTimeout(() => document.querySelector(".alert").remove(),3000);
    }

    static successMessage(){
        document.querySelector("#success").innerHTML
        = '<div class="alert alert-success alert-dismissible fade show text-center" role="alert">Book added successfully!</div>';
    }
}

// Store Class : Handles Storage

class Store {
    // static methods can be called without bein instanciated
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index,1);
            } 
        });

        localStorage.setItem('books', JSON.stringify(books));
        return books;
    }
}


// Event : Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event : Add a book
document.querySelector('#form-book').addEventListener('submit', (event) => {
    
    // Prevent actual submit
    event.preventDefault();
    
    //Get form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;
    
    // Check fields before submitting
    if(title == "" || author == "" || isbn == ""){
        UI.showAlert("Please fill in all fields","danger");
    } else {
         // Initiate book
        var book = new Book(title, author, isbn);
        // Add book to UI
        UI.addBookToList(book);

        // Add book to Store
        Store.addBook(book);

        // Succes message 
        UI.showAlert("Book added successfully","success");

        // Clear fields
        UI.clearFields();
        
    }
});

// Event : Remove a book from UI
document.querySelector('#book-list').addEventListener('click', (event) => {
    UI.deleteBook(event.target);
    //Remove book from store
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
    UI.showAlert("Book removed successfully", "info")
});