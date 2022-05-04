process.env.NODE_ENV = 'test'
const request = require('supertest');
const app = require('./app')
const db = require('./db')


let testBook;
let book_isbn;
beforeEach(async()=>{
    const results = await db.query(`
    INSERT INTO
    books
    (isbn,amazon_url,author,language,pages,publisher,title,year)
    VALUES('0593158237', 'https://www.amazon.com/Future-Yours-Novel-Dan-Frey/dp/0593158237/ref=asc_df_0593158237/?tag=hyprod-20&linkCode=df0&hvadid=583511040923&hvpos=&hvnetw=g&hvrand=16375960685193716608&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9016802&hvtargid=pla-1644702488762&psc=1',
    'Dan Frey','English',352,'Del Ray', 'The Future Is Yours', 2022)
    RETURNING *`)
    testBook = results.rows[0]
    book_isbn = results.rows[0].isbn
})


afterEach(async ()=>{
    await db.query('DELETE FROM books')
})

afterAll(async()=>{
    await db.end()
})


describe("POST /books", function () {
    test("Creates a new book", async function () {
      const response = await request(app)
          .post(`/books`)
          .send({
            isbn: '32794782',
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            publisher: "yeah right",
            title: "amazing times",
            year: 2000
          });
      expect(response.statusCode).toBe(201);
      expect(response.body.book).toHaveProperty("isbn");
    });
  
    test("Prevents creating book without required title", async function () {
      const response = await request(app)
          .post(`/books`)
          .send({year: 2000});
      expect(response.statusCode).toBe(400);
    });
  });
  
  
  describe("GET /books", function () {
    test("Gets a list of 1 book", async function () {
      const response = await request(app).get(`/books`);
      const books = response.body.books;
      expect(books).toHaveLength(1);
      expect(books[0]).toHaveProperty("isbn");
      expect(books[0]).toHaveProperty("amazon_url");
    });
  });
  
  
  describe("GET /books/:isbn", function () {
    test("Gets a single book", async function () {
      const response = await request(app)
          .get(`/books/${book_isbn}`)
      expect(response.body.book).toHaveProperty("isbn");
      expect(response.body.book.isbn).toBe(book_isbn);
    });
  
    test("Responds with 404 if can't find book in question", async function () {
      const response = await request(app)
          .get(`/books/999`)
      expect(response.statusCode).toBe(404);
    });
  });
  
  
  
  
  
  describe("DELETE /books/:id", function () {
    test("Deletes a single a book", async function () {
      const response = await request(app)
          .delete(`/books/${book_isbn}`)
      expect(response.body).toEqual({message: "Book deleted"});
    });
  });