import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as mongoose from 'mongoose';
import { Group } from '../../../src/groups/group';

import app from '../../../src/app';


chai.use(chaiHttp);
const expect = chai.expect;

describe('GET v1/groups', () => {
    it('responds with JSON array', () => {
        return chai.request(app).get('/v1/groups')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(2);
            });
    });
    it('should include Lambik', () => {
        return chai.request(app).get('/v1/groups')
            .then(res => {
                let Lambik = res.body.find(group => group.name == 'Lambik');
                expect(Lambik).to.exist;
                expect(Lambik).to.have.keys([
                    '_id',
                    'name',
                    'level'
                ]);
            });
    });
});

describe('GET v1/groups/58d6e2e63e17d80fc4c5f411', () => {
    it('should responds with single json object', () => {
        return chai.request(app).get('/v1/groups/58d6e2e63e17d80fc4c5f411')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
            });
    });
    it('should return Kuifje', () => {
        return chai.request(app).get('/v1/groups/58d6e2e63e17d80fc4c5f411')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.name).to.equal('Kuifje');
                expect(res.body.level).to.equal('L1');
            });
    });
});

describe('POST v1/groups', () => {
    var group = null;
    afterEach(done => {
        Group.find({ name: 'TestGroup' }).remove().exec();
        done();
    });

    it('should add a new group', () => {
        let data = {
            name: 'TestGroup',
            level: 'L2'
        }
        return chai.request(app).post('/v1/groups')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(data)
            .then(res => {
                expect(res).to.have.status(201);
                expect(res).to.have.header('location', `/v1/groups/${res.body._id}`)
                expect(res).to.be.json;
                expect(res.body).to.contain.all.keys(['_id']);
                expect(res.body.name).to.equal(data.name);
                expect(res.body.level).to.equal(data.level);
            });
    });
});

describe('PUT v1/groups/58d6e2e63e17d80fc4c5f411', () => {
    var original = null;
    beforeEach(done => {
        Group.findById('58d6e2e63e17d80fc4c5f411')
            .then(group => {
                original = group;
                done();
            })
    });
    afterEach(done => {
        Group.findByIdAndUpdate('58d6e2e63e17d80fc4c5f411', { $set: original })
            .then(() => {
                done();
            });
    });

    it('should update existing group', () => {
        let updated = {
            name: 'updatedGroup',
            level: 'L123'
        }
        return chai.request(app).put('/v1/groups/58d6e2e63e17d80fc4c5f411')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(updated)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body._id).to.equal('58d6e2e63e17d80fc4c5f411');
                expect(res.body.name).to.equal(updated.name);
                expect(res.body.level).to.equal(updated.level);
            });
    });
});

describe('DELETE v1/groups/58d6e2e63e17d80fc4c5f411', () => {
    var group;
    beforeEach(done => {
        let data = {
            name: 'ToDelete',
            level: 'LDel'
        }
        group = new Group(data);
        group.save()
            .then(() => {
                done();
            });
    });

    it('should remove the new object', () => {
        return chai.request(app).del(`/v1/groups/${group._id}`)
            .then(res => {
                expect(res).to.have.status(204);
            });
    });
});