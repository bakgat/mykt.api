import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import chaiDatetime = require('chai-datetime');
import * as mongoose from 'mongoose';

import app from '../../../src/app';
import { Role } from '../../../src/roles/role';


chai.use(chaiHttp).use(chaiDatetime);
const expect = chai.expect;

let roleId = '58de4f9910cb3b7a18e1171b';


describe('GET v1/roles', () => {
    it('responds with JSON array', () => {
        return chai.request(app).get('/v1/roles')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(3);
            });
    });
    it('should contain admin', () => {
        return chai.request(app).get('/v1/roles')
            .then(res => {
                let admin = res.body.find(role => role.name == 'admin');
                expect(admin).to.exist;

            });
    });
});
describe(`v1/roles/${roleId}`, () => {
    it('responds with a single json object', () => {
        return chai.request(app).get(`/v1/roles/${roleId}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.name).to.equal('admin');
            });
    });
    it('responds with 404 when not found', () => {
        return chai.request(app).get('/v1/roles/60da67d410cb3b7a18e11716')
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
    it('responds with 500 when no ObjectId is passed', () => {
        return chai.request(app).get('/v1/roles/foo')
            .catch(res => {
                expect(res).to.have.status(500);
            });
    });
});

describe('POST v1/roles', () => {
    let newRole = {
        name: 'New'
    };
    afterEach(done => {
        Role.find({ name: 'New' }).remove().then(() => {
            done();
        });
    })

    it('should add new role', () => {
        return chai.request(app).post('/v1/roles')
            .send(newRole)
            .then(res => {
                expect(res).to.have.status(201);
                let id = res.body._id;
                expect(res).to.have.header('location', `/v1/roles/${id}`);
                expect(res).to.be.json;
                expect(res.body.name).to.equal(newRole.name);
            });
    });
});

describe(`PUT v1/roles/${roleId}`, () => {
    var original = null;
    let updated = {
        name: 'updated'
    };
    beforeEach(done => {
        Role.findById(roleId)
            .then(role => {
                original = role;
                done();
            });
    });
    afterEach(done => {
        Role.findByIdAndUpdate(roleId, { $set: original })
            .then(() => {
                done();
            })
    });

    it('should update existing role', () => {
        return chai.request(app).put(`/v1/roles/${roleId}`)
            .send(updated)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body._id).to.equal(roleId);
                expect(res.body.name).to.equal(updated.name);
            });
    });
    it('responds with 404 when not found', () => {
        return chai.request(app).put('/v1/roles/60da67d410cb3b7a18e11716')
            .send(updated)
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
});

describe('DELETE v1/students/:id', () => {
    var role;
    beforeEach(done => {
        let data = {
            name: 'ToDelete'
        };
        role = new Role(data);
        role.save()
            .then(() => {
                done();
            });
    });

    it('should remove the new object', () => {
        return chai.request(app).del(`/v1/roles/${role._id}`)
            .then(res => {
                expect(res).to.have.status(204);
            });
    });
});

describe('DELETE v1/roles/foo', () => {
    it('responds with 404 when not found', () => {
        return chai.request(app).del('/v1/roles/60da67d410cb3b7a18e11716')
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
});

describe('GET v1/roles/find', () => {
    it('responds with a single json object', () => {
        return chai.request(app).get('/v1/roles/find?name=admin')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.all.keys([
                    '_id',
                    'name',
                    'permissions'
                ]);
            });
    });
});
