const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;

chai.use(chaiHttp);

let testBookId;

suite('Functional Tests', () => {

  test('POST /api/books => create book', done => {
    chai.request(server)
      .post('/api/books')
      .send({ title: 'Test Book' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'title', 'Test Book');
        assert.property(res.body, '_id');
        testBookId = res.body._id;
        done();
      });
  });

  test('GET /api/books => array of books', done => {
    chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test('GET /api/books/[id] => book object', done => {
    chai.request(server)
      .get('/api/books/' + testBookId)
      .end((err, res) => {
        assert.property(res.body, 'title');
        assert.property(res.body, 'comments');
        assert.isArray(res.body.comments);
        done();
      });
  });

  test('POST /api/books/[id] => add comment/expect book object', done => {
    chai.request(server)
      .post('/api/books/' + testBookId)
      .send({ comment: 'Great book!' })
      .end((err, res) => {
        assert.property(res.body, 'title');
        assert.property(res.body, 'comments');
        assert.isArray(res.body.comments);
        assert.include(res.body.comments, 'Great book!');
        done();
      });
  });

  test('DELETE /api/books/[id] => delete book object', done => {
    chai.request(server)
      .delete('/api/books/' + testBookId)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'delete successful');
        done();
      });
  });

  test('DELETE /api/books => delete all books', done => {
    chai.request(server)
      .delete('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'complete delete successful');
        done();
      });
  });

  test('POST /api/books => create book without title', done => {
    chai.request(server)
      .post('/api/books')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'missing required field title');
        done();
      });
  });

  test('POST /api/books/[id] => add comment without comment', done => {
    chai.request(server)
      .post('/api/books/' + testBookId)
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'missing required field comment');
        done();
      });
  });

  test('GET /api/books/[id] => book object with invalid id', done => {
    chai.request(server)
      .get('/api/books/invalidId')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no book exists');
        done();
      });
  });

  test('DELETE /api/books/[id] => delete non-existing book', done => {
    chai.request(server)
      .delete('/api/books/invalidId')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no book exists');
        done();
      });
  });

});
