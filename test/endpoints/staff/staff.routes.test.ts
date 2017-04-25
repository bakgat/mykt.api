import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import chaiDatetime = require('chai-datetime');
import * as mongoose from 'mongoose';

import { Staff } from '../../../src/staff/staff';

import app from '../../../src/app';

chai.use(chaiDatetime).use(chaiHttp);

const expect = chai.expect;

let staffId = '58da67d410cb3b7a18e11716';

describe('GET v1/staff', () => {
    it('responds with JSON array', () => {
        return chai.request(app).get('/v1/staff')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(2);
            });
    });

    it('should include Frauke', () => {
        return chai.request(app).get('/v1/staff')
            .then(res => {
                let Frauke = res.body.find(member => member.first_name == 'Frauke');
                expect(Frauke).to.exist;
                expect(Frauke).to.contain.all.keys([
                    '_id',
                    'first_name',
                    'last_name',
                    'username',
                    'gender'
                ]);
            });
    });
});

describe('GET v1/staff/:id', () => {
    it('responds with a single JSON object', () => {
        return chai.request(app).get(`/v1/staff/${staffId}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
            });
    });
    it('should return Frauke', () => {
        return chai.request(app).get(`/v1/staff/${staffId}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.first_name).to.equal('Frauke');
                expect(res.body.last_name).to.equal('Taecke');
                expect(res.body.username).to.equal('frauke.taecke@klimtoren.be');
                expect(res.body.gender).to.equal('F');
            });
    });
    it('responds with 404 when not found', () => {
        return chai.request(app).get('/v1/staff/60da67d410cb3b7a18e11716')
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
    it('responds with 500 when no ObjectId is passed', () => {
        return chai.request(app).get('/v1/staff/foo')
            .catch(res => {
                expect(res).to.have.status(500);
            });
    });
});

describe('POST v1/staff', () => {
    let newStaff = {
        first_name: 'New',
        last_name: 'Staff',
        username: 'new.staff@klimtoren.be',
        birthday: new Date('1979/11/30'),
        gender: 'M'
    };
    afterEach(done => {
        Staff.find({ 'first_name': 'New' }).remove()
            .then(() => {
                done();
            });
    });
    it('should add new staff', () => {
        return chai.request(app).post('/v1/staff')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(newStaff)
            .then(res => {
                expect(res).to.have.status(201);
                let id = res.body._id
                expect(res).to.have.header('location', `/v1/staff/${id}`);
                expect(res).to.be.json;
                //must return newly created staff
                expect(res.body).to.contain.all.keys([
                    '_id',
                    'first_name',
                    'last_name',
                    'birthday',
                    'username',
                    'gender'
                ]);
                expect(res.body.first_name).to.equal(newStaff.first_name);
                expect(res.body.last_name).to.equal(newStaff.last_name);
                expect(res.body.username).to.equal(newStaff.username);
                expect(new Date(res.body.birthday)).to.equalDate(newStaff.birthday);
                expect(res.body.gender).to.equal('M');
            });
    });

    it('should throw 400 on validation error', () => {
        var faulty = Object.assign({}, newStaff);
        delete faulty.gender; //gender is required

        return chai.request(app).post('/v1/staff')
            .send(faulty)
            .catch(res => {
                expect(res).to.have.status(400);
                expect(res.response.res.text).to.exist;
            });
    });
});

describe(`PUT v1/staff/${staffId}`, () => {
    var original = null;
    let updated = {
        first_name: 'updated',
        last_name: 'staff',
        username: 'updated.staff@klimtoren.be',
        gender: 'M'
    }
    beforeEach(done => {
        Staff.findById(staffId)
            .then(staff => {
                original = staff;
                done();
            });
    });
    afterEach(done => {
        Staff.findByIdAndUpdate(staffId, { $set: original })
            .then(() => {
                done();
            });
    });

    it('should udpate existing staff', () => {
        return chai.request(app).put(`/v1/staff/${staffId}`)
            .send(updated)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body._id).to.equal(staffId);
                expect(res.body.first_name).to.equal(updated.first_name);
                expect(res.body.last_name).to.equal(updated.last_name);
                expect(res.body.gender).to.equal(updated.gender);
                expect(res.body.username).to.equal(updated.username);
            });
    });
    it('responds with 404 when not found', () => {
        return chai.request(app).put('/v1/staff/60da67d410cb3b7a18e11716')
            .send(updated)
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
});

describe('DELETE v1/staff/:id', () => {
    var staff;
    beforeEach(done => {
        let data = {
            first_name: 'ToDelete',
            last_name: ':-)',
            gender: 'F',
            username: 'todelete@klimtoren.be'
        }
        staff = new Staff(data);
        staff.save()
            .then(() => {
                done();
            });
    });

    it('should remove the new object', () => {
        return chai.request(app).del(`/v1/staff/${staff._id}`)
            .then(res => {
                expect(res).to.have.status(204);
            });
    });
});

describe('DELETE v1/staff/foo', () => {
    it('responds with 404 when not found', () => {
        return chai.request(app).del('/v1/staff/60da67d410cb3b7a18e11716')
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
});

describe(`GET v1/staff/${staffId}/roles`, () => {
    it('responds with a json array', () => {
        return chai.request(app).get(`/v1/staff/${staffId}/roles`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(2);
            });
    });

    it('should include admin', () => {
        return chai.request(app).get(`/v1/staff/${staffId}/roles`)
            .then(res => {
                let admin = res.body.find(role => role = 'admin');
                expect(admin).to.exist;
            });
    });
});

describe(`POST v1/staff/${staffId}/roles`, () => {
    let data = {
        role: 'teacher'
    };

    afterEach(done => {
        Staff.findByIdAndUpdate(staffId,
            {
                $pull: {
                    roles: 'teacher'
                }
            }).exec(() => {
                done();
            });
    });

    it('should add a role to a member and return role added', () => {
        return chai.request(app).post(`/v1/staff/${staffId}/roles`)
            .send(data)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.all.keys([
                    '_id',
                    'name',
                    'permissions'
                ])
            });
    });
});

describe(`DELETE v1/staff/${staffId}/roles/:role`, () => {
    var role = null;
    let data = 'teacher';
    beforeEach(done => {
        Staff.findByIdAndUpdate(staffId,
            { $push: { roles: data } })
            .then(result => {
                done();
            });
    });

    it('should remove a group subscription', () => {
        return chai.request(app).del(`/v1/staff/${staffId}/roles/teacher`)
            .then(res => {
                expect(res).to.have.status(204);
            });
    });
});