var booksInitial = []; // reference of all books for fav List
var query = ""; // query entered by user
var xhttp = new XMLHttpRequest();

function Book(book) {
    let title = book.volumeInfo.title;
    let description = book.volumeInfo.description;
    let publishedDate = book.volumeInfo.publishedDate;
    let authors;
    if (book.volumeInfo.authors) {
        authors = book.volumeInfo.authors[0];
    }
    let image = book.volumeInfo.imageLinks.thumbnail;
    Object.defineProperty(this, 'title', {
        get: function () {
            return title
        },
        set: function (value) {
            if (!value) throw new Error('Invalid title')
            title = value;
        }
    });
    Object.defineProperty(this, 'description', {
        get: function () {
            return description
        },
        set: function (value) {
            if (!value) throw new Error('Invalid description')
            description = value;
        }
    });
    Object.defineProperty(this, 'publishedDate', {
        get: function () {
            return publishedDate
        },
        set: function (value) {
            if (!value) throw new Error('Invalid publishedDate')
            publishedDate = value;
        }
    });
    Object.defineProperty(this, 'authors', {
        get: function () {
            return authors
        },
        set: function (value) {
            if (!value) throw new Error('Invalid authors')
            authors = value;
        }
    });
    Object.defineProperty(this, 'image', {
        get: function () {
            return image
        },
        set: function (value) {
            if (!value) throw new Error('Invalid image')
            image = value;
        }
    });
}

function likedBook(book, liked){
    let title = book.volumeInfo.title;
    let id = book.id;
    let likedStatus = liked;
   
    Object.defineProperty(this, 'title', {
        get: function () {
            return title
        },
        set: function (value) {
            if (!value) throw new Error('Invalid title')
            title = value;
        }
    });
    Object.defineProperty(this, 'id', {
        get: function () {
            return id
        },
        set: function (value) {
            if (!value) throw new Error('Invalid id')
            id = value;
        }
    });
    Object.defineProperty(this, 'likedStatus', {
        get: function () {
            return likedStatus
        },
        set: function (value) {
            if (!value) throw new Error('Invalid liked status')
            likedStatus = value;
        }
    });
}

// Successfully run callAjax and set books from response to display
xhttp.onreadystatechange = function () {
    // check if api call was succesfull and ready with response
    if (this.readyState == 4 && this.status == 200) {
        booksInitial = JSON.parse(this.responseText)
        setBooksCurrent(JSON.parse(this.responseText)) // Setting books to ui using vanilla methods
    }
}
xhttp.open("GET", "http://localhost:5000/api/books", true);
xhttp.send();

/**
 * @desc using the query entered an API is called using GET method and new set of books is fetched
 * @param object $event - event created from every text input
 */
function getNewBooks(event) {
    if (event.keyCode >= 48 && event.keyCode <= 90) query = query + event.key /*  concatenate key entered only if 0 to 9 or a-b or A-B */
    else if (event.keyCode === 8) query = query.slice(0, -1) /* delete key if entered key is backspace  */
    let fetchBooksWithQuery = `http://localhost:5000/api/book/${query}`; /* endpoint for any query input  */
    let fetchAllBooks = `http://localhost:5000/api/books`; /* endpoint for blank query input, so all books are fetched  */
    xhttp.onreadystatechange = function () { // check if api call was succesfull and ready with response
        if (this.readyState == 4 && this.status == 200) setBooksCurrent(JSON.parse(this.responseText)) // Setting books to ui using vanilla methods
    };
    // If there is no query all books are fetched else the query with the resulted books
    query === "" ? xhttp.open("GET", fetchAllBooks, true) : xhttp.open("GET", fetchBooksWithQuery, true)
    xhttp.send();
}

/**
 * @desc acts a wrapper class and delay the function enclosing it
 * @param func $fn - the function to be delayed
 * @param number $ms - the delayed value in milliseconds
 * @return function 
 */
function delay(fn, ms) {
    let timer;
    return function () {
        let context = this, args = arguments;
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, arguments)
        }, ms)
    }
}

/**
 * @desc takes the key entered on keyup event and calls the getnewbooks function with delay of 500
 * @param object $event - event created from every text input
 */
// function getNewBookFromEntry(event) {
//     delay(getNewBooks(event), 500)
// }
const getNewBookFromEntry = delay(getNewBooks, 500)

/**
 * @desc set books fetched and creating book cards dynamically and also adding event listeners to the favorite button
 * @param object $booksResponse - the books currently fetched from API
 */
function setBooksCurrent(booksResponse) {
    let booksList = document.getElementById("booksContainer__list"); // Book Container List Main Parent
    let bookCount = document.getElementById("bookCount"); // Number of books currently displayed fetched from query
    bookCount.innerHTML = booksResponse.length;
    booksList.querySelectorAll('*').forEach(n => n.remove()); // Resetting the cards List after after query search and initial query

    // Creating elements and setting classes and attributes
    booksResponse.map((book) => {
        const bookObject = new Book(book);
        let bookCard = document.createElement("li"); // Book List Item
        bookCard.setAttribute("class", "booksContainer__list__item");
        let bookCardLink = document.createElement("div"); // Book List Item Link
        bookCardLink.setAttribute("class", "booksContainer__list__item__link");
        let bookCardContent = document.createElement("div"); // Book List Item Content
        bookCardContent.setAttribute("class", "booksContainer__list__item__content");
        bookCardContent.setAttribute("id", book.id);
        let likeButton = document.createElement("span"); // Book List Item Like Button
        likeButton.setAttribute("class", "booksContainer__list__item__content__likeButton lni lni-heart");
        let bookTitle = document.createElement("h2"); // Book List Item Title
        bookTitle.setAttribute("class", "hoverContentAuthor");
        bookTitle.innerHTML = bookObject.title;
        let bookFooter = document.createElement("div"); // Book List Item Footer Content
        bookFooter.setAttribute("class", "booksContainer__list__item__footer");
        let bookDescription = document.createElement("p"); // Book List Item Description
        bookDescription.setAttribute("class", "book__description");
        bookDescription.innerHTML = bookObject.description;
        let bookPublishedDate = document.createElement("time"); // Book List Item Published Date
        // If no date then no date is displayed
        if (bookObject.publishedDate) {
            bookPublishedDate.innerHTML = bookObject.publishedDate;
        }
        let bookCardHover = document.createElement("div"); // Book List Item Hover Content
        bookCardHover.setAttribute("class", "hoverContent");
        let bookAuthor = document.createElement("p"); // Book List Item Author
        bookAuthor.setAttribute("class", "booksContainer__list__item__title");
        // If no author then no author is displayed
        if (bookObject.authors) {
            bookAuthor.innerHTML = bookObject.authors;
        }
        let gradientHover = document.createElement("div"); // Creat gradient overlay dynamically with class
        gradientHover.setAttribute("class", "gradient_hover");
        let bookImage = document.createElement("img");
        bookImage.setAttribute("src", bookObject.image);
        bookImage.setAttribute("alt", bookObject.title);

        // Append child to their parent and doing nesting
        bookCardHover.appendChild(bookTitle);
        bookCardHover.appendChild(bookImage);
        bookCardHover.appendChild(gradientHover);
        if (bookObject.authors) {
            bookFooter.appendChild(bookPublishedDate);
        }
        bookFooter.appendChild(bookDescription);
        bookCardContent.appendChild(likeButton);
        bookCardContent.appendChild(bookAuthor);
        bookCardContent.appendChild(bookFooter);
        bookCardContent.appendChild(bookCardHover);
        bookCardLink.appendChild(bookCardContent);
        bookCard.appendChild(bookCardLink);
        booksList.appendChild(bookCard);
        setLikedFromLocalStorage(likeButton)

        // Adding event listener to like button
        likeButton.addEventListener('click', () => {
            let favListIDs = []; // list of all ids
            let itemToPush = likeButton.parentElement.getAttribute('id'); // save id value to variable
            let booksListCount = document.getElementById("currentFavs"); // current favorite list Count
            let favListParent = document.getElementById("booksContainer__fav__list"); // fav List parent to set dynamically
            // If localstorage key already exists
            if (localStorage.getItem('fav-list')) { // fetch items from key as string and parse and store in favlist
                let favList = JSON.parse(localStorage.getItem('fav-list'));
                favListIDs.push(...favList);
                // itemToPush already existing, then filter out 
                if (favListIDs.find((value) => value == itemToPush)) favListIDs = favListIDs.filter((favItem) => favItem !== itemToPush)
                else favListIDs.push(itemToPush); // else push item to favlist ids
                localStorage.setItem('fav-list', JSON.stringify(favListIDs)); // set to local storage with update favlist ids
            } else { // If localstorage key dont exists
                favListIDs.push(itemToPush);
                localStorage.setItem('fav-list', JSON.stringify(favListIDs));
            }
            booksListCount.innerHTML = favListIDs.length; // Setting the count in UI
            //dynamically updating the list of favorite books in ui with title
          
            favListParent.querySelectorAll('*').forEach(n => n.remove()); // reset the fav list at every update
            // adding class of font awesome to create select and not select heart icon
            if (likeButton.classList.contains("lni-heart")) {
                likeButton.removeAttribute("class", "lni-heart");
                likeButton.setAttribute("class", "booksContainer__list__item__content__likeButton lni lni-heart-filled");
            } else {
                likeButton.removeAttribute("class", "lni-heart-filled");
                likeButton.setAttribute("class", "booksContainer__list__item__content__likeButton lni lni-heart");
            }
            booksInitial.map((value) => {
                if (JSON.stringify(favListIDs).indexOf(value.id) > 0) {
                    const likeBookObject = new likedBook(value, true)
                    let bookListItem = document.createElement("li");
                    bookListItem.setAttribute("class", "booksContainer__fav__list__item");
                    bookListItem.innerText = likeBookObject.title;
                    favListParent.appendChild(bookListItem);
                } 
            })
        })
    })
}

// set the liked books status from local storage initially
function setLikedFromLocalStorage(element) {
    let favListIDs = [];
    let idOfButton = element.parentElement.getAttribute('id'); // like button id
    let favListParent = document.getElementById("booksContainer__fav__list"); // fav list parent id reference
    if (localStorage.getItem('fav-list')) { // setting initial liked status of book card if local storage exists
        // fetch items from key as string and parse and store in favlist
        let favList = JSON.parse(localStorage.getItem('fav-list'));
        favListIDs.push(...favList);
        favListParent.querySelectorAll('*').forEach(n => n.remove()); // reset the fav list at every update
        // mapping and setting status for every item
        booksInitial.map((value) => {
            if (JSON.stringify(favListIDs).indexOf(value.id) > 0) {
                const likeBookObject = new likedBook(value, true)
                if (value.id === idOfButton) {
                    element.removeAttribute("class", "lni-heart");
                    element.setAttribute("class", "booksContainer__list__item__content__likeButton lni lni-heart-filled");
                }
                let bookListItem = document.createElement("li");
                bookListItem.setAttribute("class", "booksContainer__fav__list__item");
                bookListItem.innerText = likeBookObject.title;
                favListParent.appendChild(bookListItem);
            }
        })
    }
}