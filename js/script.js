// Books CRUD App with jQuery animations
$(document).ready(function () {
  let books = JSON.parse(localStorage.getItem("books")) || [];

  function displayBooks() {
    $("#bookList").empty();
    books.forEach((book, index) => {
      const card = $(`
                <div class="col-md-4">
                    <div class="card">
                        <img src="${book.image}" class="card-img-top" alt="Book Image">
                        <div class="card-body">
                            <h5 class="card-title">📖 ${book.title}</h5>
                            <p class="card-text"><strong>✍️ Author:</strong> ${book.author}</p>
                            <p class="card-text">📝 ${book.description}</p>
                            <button class="btn btn-warning btn-sm edit" data-index="${index}">Update</button>
                            <button class="btn btn-danger btn-sm delete" data-index="${index}">Delete</button>
                        </div>
                    </div>
                </div>
            `);
      card.hide().appendTo("#bookList").fadeIn(600); // fade-in animation

      // Hover animation with jQuery
      card.find(".card").hover(
        function () {
          $(this)
            .animate({ top: "-=5px" }, 200)
            .css("box-shadow", "0 8px 20px rgba(0,0,0,0.3)");
        },
        function () {
          $(this)
            .animate({ top: "0px" }, 200)
            .css("box-shadow", "0 4px 12px rgba(0,0,0,0.2)");
        }
      );
    });
  }

  displayBooks();

  $("#bookForm").submit(function (e) {
    e.preventDefault();
    const file = $("#image")[0].files[0];
    const editIndex = $(this).data("editIndex");

    function saveBook(imageData) {
      const book = {
        title: $("#title").val(),
        author: $("#author").val(),
        description: $("#description").val(),
        image: imageData,
      };

      if (editIndex !== undefined) {
        books[editIndex] = book;
        $("#formButton")
          .text("Add Book")
          .removeClass("btn-success")
          .addClass("btn-primary");
        $("#bookForm").removeData("editIndex");
      } else {
        books.push(book);
      }

      localStorage.setItem("books", JSON.stringify(books));
      displayBooks();
      $("#bookForm")[0].reset();
      $("#bookForm").removeData("currentImage");
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        saveBook(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      const existingImage = $("#bookForm").data("currentImage") || "";
      saveBook(existingImage);
    }
  });

  $(document).on("click", ".delete", function () {
    const index = $(this).data("index");
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
  });

  $(document).on("click", ".edit", function () {
    const index = $(this).data("index");
    const book = books[index];

    $("#title").val(book.title);
    $("#author").val(book.author);
    $("#description").val(book.description);

    $("#bookForm").data("currentImage", book.image);
    $("#bookForm").data("editIndex", index);

    // Change button to green "Update Book"
    $("#formButton")
      .text("Update Book")
      .removeClass("btn-primary")
      .addClass("btn-success");
  });
});
