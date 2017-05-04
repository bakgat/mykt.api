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