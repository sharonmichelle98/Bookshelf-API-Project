const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.find((book) => book.id === newBook.id) !== undefined;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      }
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};


const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let bookData = books;

  const bookUndefined = books.length === 0;
  const searchedBookName = name.toLowerCase();

  if (name !== undefined) {
    bookData = bookData.filter((book) => book.name.toLowerCase().includes(searchedBookName));
    return bookData;
  }

  if (reading === 0) {
    bookData = bookData.filter((book) => book.reading === false);
    return bookData;
  } else if (reading === 1) {
    bookData = bookData.filter((book) => book.reading === true);
    return bookData;
  }

  if (finished === 0) {
    bookData = bookData.filter((book) => book.finished === false);
    return bookData;
  } else if (finished === 1) {
    bookData = bookData.filter((book) => book.finished === true);
    return bookData;
  }

  const fixedBookData = bookData.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (bookUndefined) {
    return {
      status: 'success',
      data: {
        books: [],
      }
    };
  }

  const response = h.response({
    status: 'success',
    data: {
      books: fixedBookData,
    }
  });
  response.code(200);
  return response;
};


const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const lookedBook = books.filter((book) => book.id === bookId)[0];

  if (lookedBook !== undefined) {
    return {
      status: 'success',
      data: {
        lookedBook,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};


const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler, };
