
const searchResultsElement = document.getElementById('searchResults');
const cartItemsElement = document.getElementById('cartItems');
const searchInputElement = document.getElementById('searchInput');


async function fetchBooks(query) {
    const url = `http://openlibrary.org/search.json?q=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`${data.error ? data.error : 'Failed to fetch data'}`);
        }

        return data.docs;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


function displaySearchResults(books) {
    searchResultsElement.innerHTML = '';

    books.forEach(book => {
        const bookCard = createBookCard(book);
        searchResultsElement.appendChild(bookCard);
    });
}


function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('p-4', 'bg-white', 'rounded', 'shadow', 'text-lg', 'cursor-pointer');

    const titleElement = document.createElement('h2');
    titleElement.classList.add('font-bold', 'text-xl', 'mb-2');
    titleElement.textContent = book.title;

    const authorElement = document.createElement('p');
    authorElement.classList.add('text-gray-700', 'mb-2');
    authorElement.textContent = `Author: ${book.author_name ? book.author_name.join(', ') : 'Unknown'}`;

    const coverImage = document.createElement('img');
    coverImage.classList.add('my-2', 'mx-auto');
    coverImage.src = `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    coverImage.alt = `${book.title} cover`;

    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('bg-blue-500', 'hover:bg-blue-600', 'text-white', 'px-4', 'py-2', 'rounded', 'mt-2');
    addToCartButton.textContent = 'Add to Cart';

    addToCartButton.addEventListener('click', () => addToCart(book));

    bookCard.appendChild(titleElement);
    bookCard.appendChild(authorElement);
    bookCard.appendChild(coverImage);
    bookCard.appendChild(addToCartButton);

    return bookCard;
}


function addToCart(book) {
    const cartItem = document.createElement('li');
    cartItem.classList.add('p-4', 'flex', 'justify-between', 'items-center');

    const cartItemInfo = document.createElement('div');
    const titleElement = document.createElement('h3');
    titleElement.classList.add('text-lg', 'font-semibold');
    titleElement.textContent = book.title;
    const authorElement = document.createElement('p');
    authorElement.textContent = `Author: ${book.author_name ? book.author_name.join(', ') : 'Unknown'}`;

    cartItemInfo.appendChild(titleElement);
    cartItemInfo.appendChild(authorElement);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('text-red-600', 'font-bold', 'hover:text-red-800');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => removeFromCart(cartItem));

    cartItem.appendChild(cartItemInfo);
    cartItem.appendChild(deleteButton);

    cartItemsElement.appendChild(cartItem);
}


function removeFromCart(cartItem) {
    cartItem.remove();
}


searchInputElement.addEventListener('input', async function() {
    const query = this.value.trim();

    if (query.length < 3) {
        searchResultsElement.innerHTML = '<p class="text-gray-600">Enter at least 3 characters to search.</p>';
        return;
    }

    const books = await fetchBooks(query);
    displaySearchResults(books);
});
