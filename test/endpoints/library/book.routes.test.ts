import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import chaiDatetime = require('chai-datetime');
import * as mongoose from 'mongoose';

import app from '../../../src/app';
import { Book } from '../../../src/library/index';


chai.use(chaiHttp).use(chaiDatetime);
const expect = chai.expect;

let bookId = '5909a1dd25ef9776e187759f';
let newBook = {
    title: "Sinterklaas",
    isbn: "9789056379858",
    summary: "Sinterklaas en zijn pieten hebben veel werk verzet voordat ze per stoomboot in Nederland aankomen met al hun pakjes. Tekstloos prentenboek met grote, zeer gedetailleerde illustraties in sprekende kleuren. Vanaf ca. 4 jaar",
    authors: ["Charlotte Dematons"],
    publishers: ["Lemniscaat"],
    publishedDate: "2013",
    pageCount: 28,
    language: "nl",
    imageLinks: {
        smallThumbnail: "http://books.google.com/books/content?id=sDyQ48ZtJUkC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail: "http://books.google.com/books/content?id=sDyQ48ZtJUkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    age: {
        min: 4
    },
    tags: ["Sinterklaas"],
    groups: ["prentenboek", "Sinterklaas"]
}

describe('GET v1/library/books', () => {
    it('responds with JSON array', () => {
        return chai.request(app).get('/v1/library/books')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(2);
            });
    });
    it('should contain "Is zoenen ook seks ? / druk 1"', () => {
        return chai.request(app).get('/v1/library/books')
            .then(res => {
                let book1 = res.body.find(book => book.title == 'Is zoenen ook seks ? / druk 1');
                expect(book1).to.exist;

            });
    });
});

describe(`v1/library/books/${bookId}`, () => {
    it('responds with a single json object', () => {
        return chai.request(app).get(`/v1/library/books/${bookId}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.title).to.equal('Is zoenen ook seks ? / druk 1');
            });
    });
    it('responds with 404 when not found', () => {
        return chai.request(app).get('/v1/library/books/60da67d410cb3b7a18e11716')
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
    it('responds with 500 when no ObjectId is passed', () => {
        return chai.request(app).get('/v1/library/books/foo')
            .catch(res => {
                expect(res).to.have.status(500);
            });
    });
});

describe('POST v1/roles', () => {

    afterEach(done => {
        Book.find({ title: 'Sinterklaas' }).remove().then(() => {
            done();
        });
    })

    it('should add new book', () => {
        return chai.request(app).post('/v1/library/books')
            .send(newBook)
            .then(res => {
                expect(res).to.have.status(201);
                let id = res.body._id;
                expect(res).to.have.header('location', `/v1/library/books/${id}`);
                expect(res).to.be.json;
                expect(res.body.title).to.equal(newBook.title);
                expect(res.body.isbn).to.equal(newBook.isbn);
                expect(res.body.summary).to.equal(newBook.summary);
                expect(res.body.authors).to.be.an('array');
                expect(res.body.authors).to.have.length(1);
                expect(res.body.authors[0]).to.equal(newBook.authors[0]);
                expect(res.body.publishers).to.be.an('array');
                expect(res.body.publishers).to.have.length(1);
                expect(res.body.publishers[0]).to.equal(newBook.publishers[0]);
                expect(res.body.publishedDate).to.equal(newBook.publishedDate);
                expect(res.body.pageCount).to.equal(newBook.pageCount);
                expect(res.body.language).to.equal(newBook.language);
                expect(res.body.tags).to.be.an('array');
                expect(res.body.tags).to.have.length(1);
                expect(res.body.groups).to.be.an('array');
                expect(res.body.groups).to.have.length(2);
                expect(res.body.age.min).to.equal(newBook.age.min);
                expect(res.body.age.max).not.to.exist;
            });
    });
});


describe(`PUT v1/library/books/${bookId}`, () => {
    var original = null;
    let updated = {
        title: 'updated',
        age: { min: 4, max: 15 }
    };
    beforeEach(done => {
        Book.findById(bookId)
            .then(book => {
                original = book;
                done();
            });
    });
    afterEach(done => {
        delete original._id;
        Book.findByIdAndUpdate(bookId, { $set: original })
            .then(() => {
                done();
            })
    });

    it('should update existing book', () => {
        return chai.request(app).put(`/v1/library/books/${bookId}`)
            .send(updated)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body._id).to.equal(bookId);
                expect(res.body.title).to.equal(updated.title);
                expect(res.body.age.min).to.equal(updated.age.min);
                expect(res.body.age.max).to.equal(updated.age.max);
            });
    });
    it('responds with 404 when not found', () => {
        return chai.request(app).put('/v1/library/books/60da67d410cb3b7a18e11716')
            .send(updated)
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
});

describe('DELETE v1/library/books/:id', () => {
    var book;
    beforeEach(done => {

        book = new Book(newBook);
        book.save()
            .then(() => {
                done();
            });
    });

    it('should remove the new book', () => {
        return chai.request(app).del(`/v1/library/books/${book._id}`)
            .then(res => {
                expect(res).to.have.status(204);
            });
    });
});

describe('DELETE v1/library/books/foo', () => {
    it('responds with 404 when not found', () => {
        return chai.request(app).del('/v1/library/books/60da67d410cb3b7a18e11716')
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
});

describe('GET v1/library/books/tags', () => {
    it('responds with JSON array', () => {
        return chai.request(app).get('/v1/library/books/tags')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(3);
            });
    });
});

describe(`POST v1/library/books/tags`, () => {
    it('should add new tag and responds with full tag array', () => {
        return chai.request(app).post(`/v1/library/books/${bookId}/tags`)
            .send({ tag: 'Nieuwe tag' })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(3);
                let newTag = res.body.find(t => { return t == 'Nieuwe tag' });
                expect(newTag).to.exist;
            });
    });
});

describe(`DELETE v1/library/books/${bookId}/tags`, () => {
    beforeEach(done => {
        Book.findByIdAndUpdate(bookId, { $push: { tags: 'Nieuwe tag' } }).exec()
            .then(() => { done(); });
    });
    it('should remove existing tag and response with full tag array', () => {
        return chai.request(app).del(`/v1/library/books/${bookId}/tags`)
            .send({ tag: 'Nieuwe tag' })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(2);
            });
    });
});

describe('GET v1/library/books/groups', () => {
    it('responds with JSON array', () => {
        return chai.request(app).get('/v1/library/books/groups')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(4);
            });
    });
});

describe(`POST v1/library/books/groups`, () => {
    it('should add new group and responds with full group array', () => {
        return chai.request(app).post(`/v1/library/books/${bookId}/groups`)
            .send({ group: 'Nieuwe groep' })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(4);
                let newTag = res.body.find(t => { return t == 'Nieuwe groep' });
                expect(newTag).to.exist;
            });
    });
});

describe(`DELETE v1/library/books/${bookId}/groups`, () => {
    beforeEach(done => {
        Book.findByIdAndUpdate(bookId, { $push: { groups: 'Nieuwe groep' } }).exec()
            .then(() => { done(); });
    });
    it('should remove existing group and response with full group array', () => {
        return chai.request(app).del(`/v1/library/books/${bookId}/groups`)
            .send({ group: 'Nieuwe groep' })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(3);
            });
    });
});

describe(`PATCH v1/library/books/${bookId}`, () => {
    var original;
    beforeEach(done => {
        Book.findById(bookId)
            .then(book => {
                original = book;
                done();
            });
    });
    afterEach(done => {
        Book.findByIdAndUpdate(bookId, { $set: original })
            .then(() => {
                done();
            });
    });

    it('patch age min and max, age object should be returned', () => {
        return chai.request(app).patch(`/v1/library/books/${bookId}`)
            .send({ op: 'age', min: 5, max: 15  })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.age.min).to.equal(5);
                expect(res.body.age.max).to.equal(15);
            });
    });

    it('patch notes, notes object should be returned', () => {
        return chai.request(app).patch(`/v1/library/books/${bookId}`)
            .send({ op: 'notes', notes: 'nieuwe notitie'})
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.notes).to.equal('nieuwe notitie');
            });
    });
});

describe('GET v1/library/books/authors', () => {
    it('responds with JSON array', () => {
        return chai.request(app).get('/v1/library/books/authors')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(3);
            });
    });
});