document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener("DOMContentLoaded", () => {
    const listPanel = document.getElementById("list-panel");
    const list = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
  
    const BASE_URL = "http://localhost:3000";
    const BOOKS_URL = `${BASE_URL}/books`;
    const USERS_URL = `${BASE_URL}/users`;
  
    function fetchBooks() {
      fetch(BOOKS_URL)
        .then((resp) => resp.json())
        .then((books) => {
          books.forEach((book) => {
            const li = document.createElement("li");
            li.innerText = book.title;
            li.addEventListener("click", () => {
              showBook(book);
            });
            list.appendChild(li);
          });
        })
        .catch((err) => console.error(err));
    }
  
    function showBook(book) {
      const { id, title, author, description, img_url, users } = book;
  
      showPanel.innerHTML = `
        <div>
          <img src="${img_url}" alt="${title}" />
          <h2>${title}</h2>
          <h3>by ${author}</h3>
          <p>${description}</p>
          <button id="like-btn">Like</button>
          <ul id="liked-by">
            ${users.map((user) => `<li>${user.username}</li>`).join("")}
          </ul>
        </div>
      `;
  
      const likeBtn = document.getElementById("like-btn");
      likeBtn.addEventListener("click", () => {
        likeBook(id);
      });
    }
  
    function likeBook(bookId) {
      const currentUser = { id: 1, username: "pouros" };
      const likedBy = document.getElementById("liked-by");
  
      fetch(`${BOOKS_URL}/${bookId}`)
        .then((resp) => resp.json())
        .then((book) => {
          if (book.users.some((user) => user.id === currentUser.id)) {
            // already liked, remove like
            const updatedUsers = book.users.filter(
              (user) => user.id !== currentUser.id
            );
            fetch(`${BOOKS_URL}/${bookId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ users: updatedUsers }),
            })
              .then((resp) => resp.json())
              .then((book) => {
                likedBy.innerHTML = book.users
                  .map((user) => `<li>${user.username}</li>`)
                  .join("");
              })
              .catch((err) => console.error(err));
          } else {
            // not liked, add like
            const updatedUsers = [...book.users, currentUser];
            fetch(`${BOOKS_URL}/${bookId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ users: updatedUsers }),
            })
              .then((resp) => resp.json())
              .then((book) => {
                likedBy.innerHTML = book.users
                  .map((user) => `<li>${user.username}</li>`)
                  .join("");
              })
              .catch((err) => console.error(err));
          }
        })
        .catch((err) => console.error(err));
    }
  
    fetchBooks();
  });
  