import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import chaiDatetime = require('chai-datetime');
import * as mongoose from 'mongoose';
import * as async from 'async';

import app from '../../../src/app';
import * as kiva from '../../../src/kiva/kiva.file';
import { collections } from '../../seed/db.seed';

chai.use(chaiHttp).use(chaiDatetime);
const expect = chai.expect;

let fileId = '58fbb18b71ba420bb9f241d2';
let faultyFileId = '60da67d410cb3b7a18e11716';

let newFile = {
    date: new Date(),
    victim: {
        _id: '58da34163e17d80fc4c5f416',
        display_name: "Karl Van Iseghem",
        group: "Kuifje"
    },
    summary: "New added",
    estimated_times: '2x per week',
    last_bully_date: new Date(),
    bully_timespan: "voorbije 6 maanden",
    conclusion: "Nog een klein verslagje: besluit: no-blame",
    bullies: [{ _id: "58d528003e17d80fc4c5f410", display_name: "Rebekka Buyse", group: "Lambik" }],
    announcer: { type: "parent", display_name: "Armand Van Iseghem" }
};
let newKivaAgreement = {
    _id: "58d528003e17d80fc4c5f410",
    display_name: "Rebekka Buyse",
    group: "Lambik",
    agreement: 'Ik zal het nooit meer doen'
}
let newAction = {
    type: 'no-blame',
    no_blame: {
        date: new Date(),
        students: [newKivaAgreement],
        description: 'Heel warm gesprek'
    }
}
let newVictimInterview = {
    victim: {
        _id: '58da34163e17d80fc4c5f416',
        display_name: "Karl Van Iseghem",
        group: "Kuifje"
    },
    date: new Date(),
    bully_ways: ['verbaal agressief', 'grensoverschrijdend gedrag'],
    estimated_times: '2x per week',
    last_bully_date: new Date(),
    bully_timespan: 'voorbije 6 maanden',
    bullies: [{ _id: "58d528003e17d80fc4c5f410", display_name: "Rebekka Buyse", group: "Lambik" }],
    supporters: [{ _id: "58d528003e17d80fc4c5f410", display_name: "Rebekka Buyse", group: "Lambik" }],
    description: 'Nog een verslag over wat er gebeurde door het slachtoffer verteld.'
};

describe(`GET v1/kiva/${fileId}`, () => {
    it('responds with a single json object', () => {
        return chai.request(app).get(`/v1/kiva/${fileId}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.contain.keys([
                    '_id',
                    'first_entry'
                ]);
            })
    });
    it('responds with 404 when not found', () => {
        return chai.request(app).get('/v1/kiva/60da67d410cb3b7a18e11716')
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
    it('responds with 500 when no ObjectId is passed', () => {
        return chai.request(app).get('/v1/kiva/foo')
            .catch(res => {
                expect(res).to.have.status(500);
            });
    });
});

describe('POST v1/kiva', () => {
    afterEach(done => {
        kiva.KivaFile.find({ 'first_entry.summary': 'New added' }).remove().exec();
        done();
    });

    it('should add new kiva file', () => {
        return chai.request(app).post('/v1/kiva')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(newFile)
            .then(res => {
                expect(res).to.have.status(201);
                let id = res.body._id;
                expect(res).to.have.header('location', `/v1/kiva/${id}`);
                expect(res).to.be.json;
            })
    });
});

describe(`POST v1/kiva/:id/victim`, () => {
    let id = '';
    beforeEach(done => {
        kiva.KivaFile.create({ first_entry: newFile })
            .then(result => {
                id = result._id;
                done();
            });
    });
    afterEach(done => {
        kiva.KivaFile.find({ 'first_entry.summary': 'New added' }).remove()
            .exec().then(() => { done(); });
    });

    it('should return a victim file when added', () => {
        return chai.request(app).post(`/v1/kiva/${id}/victim`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(newVictimInterview)
            .then(res => {
                expect(res).to.have.status(201);
                expect(res).to.have.header('location', `/v1/kiva/${id}/victim`);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.all.keys([
                    '_id',
                    'victim',
                    'date',
                    'bully_ways',
                    'estimated_times',
                    'last_bully_date',
                    'bully_timespan',
                    'bullies',
                    'supporters',
                    'description'
                ]);
            });
    });
    it('should return 409 when try to add new victim interview, if one already exists', () => {
        return kiva.KivaFile.findOne({ 'first_entry.summary': 'New added' })
            .then((file: kiva.IKivaFile) => {
                return file.update({ victim_interview: newVictimInterview })
                    .exec()
                    .then(() => {
                        return chai.request(app).post(`/v1/kiva/${id}/victim`)
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .send(newVictimInterview)
                            .catch(res => {
                                expect(res).to.have.status(409);
                            });
                    });

            });

    });
    it('should return 404 when kivaFile is not found', () => {
        return chai.request(app).post(`/v1/kiva/${faultyFileId}/victim`)
            .send(newVictimInterview)
            .catch(err => {
                expect(err).to.have.status(404);
            })
    });
});

describe(`PUT v1/kiva/${fileId}/victim`, () => {
    let id = '';
    beforeEach(done => {
        kiva.KivaFile.create({ first_entry: newFile, victim_interview: newVictimInterview })
            .then(result => {
                id = result._id;
                done();
            });
    });
    afterEach(done => {
        kiva.KivaFile.find({ 'first_entry.summary': 'New added' }).remove()
            .exec().then(() => { done(); });
    });

    it('should update an existing interview', () => {
        var updatedInterview = Object.assign({}, newVictimInterview);
        updatedInterview.bully_timespan = 'updated result';

        return chai.request(app).put(`/v1/kiva/${id}/victim`)
            .send(updatedInterview)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                let fields = Object.keys(updatedInterview);
                delete res.body._id; // _id field is not available in this test
                expect(res.body).to.have.all.keys(fields);
                expect(res.body.victim.display_name).to.equal(updatedInterview.victim.display_name);
            });
    });

    it('should return 404 when try to update a victiminterview in an non-existing kivafile', () => {
        var updatedInterview = Object.assign({}, newVictimInterview);
        updatedInterview.bully_timespan = 'updated result';

        return chai.request(app).put(`/v1/kiva/${faultyFileId}/victim`)
            .send(updatedInterview)
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });

    it('should return 500 when no object id is passed', () => {
        var updatedInterview = Object.assign({}, newVictimInterview);
        updatedInterview.bully_timespan = 'updated result';

        return chai.request(app).put(`/v1/kiva/foo/victim`)
            .send(updatedInterview)
            .catch(res => {
                expect(res).to.have.status(500);
            });
    });

});

describe(`POST v1/kiva/:id/action`, () => {
    let id = '';
    beforeEach(done => {
        kiva.KivaFile.create({ first_entry: newFile })
            .then(result => {
                id = result._id;
                done();
            });
    });
    afterEach(done => {
        kiva.KivaFile.find({ 'first_entry.summary': 'New added' }).remove()
            .exec().then(() => { done(); });
    });

    it('should return an action when added', () => {
        return chai.request(app).post(`/v1/kiva/${id}/action`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(newAction)
            .then(res => {
                expect(res).to.have.status(201);
                expect(res).to.have.header('location', `/v1/kiva/${id}/action/${res.body._id}`);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.all.keys([
                    '_id',
                    'type',
                    'no_blame',
                    'recovery_contract'
                ]);
                let noBlame = res.body.no_blame;
                expect(new Date(noBlame.date)).to.equalDate(newAction.no_blame.date);

                expect(noBlame.students).to.be.an('array');
                expect(noBlame.students).to.have.length(1);

                let agreement = res.body.no_blame.students[0];
                expect(agreement._id).to.equal(newAction.no_blame.students[0]._id);
                expect(agreement.display_name).to.equal(newAction.no_blame.students[0].display_name);
                expect(agreement.group).to.equal(newAction.no_blame.students[0].group);
                expect(agreement.agreement).to.equal(newAction.no_blame.students[0].agreement);

                expect(noBlame.description).to.equal(newAction.no_blame.description);
            });
    });

    it('should return 404 when kivaFile is not found', () => {
        return chai.request(app).post(`/v1/kiva/${faultyFileId}/action`)
            .send(newVictimInterview)
            .catch(err => {
                expect(err).to.have.status(404);
            })
    });
});

describe(`PUT v1/kiva/${fileId}/action/:aid`, () => {
    let id = '';
    let aid = '';
    beforeEach(done => {
        kiva.KivaFile.create({ first_entry: newFile, victim_interview: newVictimInterview, actions: [newAction] })
            .then(result => {
                id = result._id;
                aid = result.actions[0]._id;
                done();
            });
    });
    afterEach(done => {
        kiva.KivaFile.find({ 'first_entry.summary': 'New added' }).remove()
            .exec().then(() => { done(); });
    });

    it('should update an existing action', () => {
        var updatedAction = Object.assign({ _id: aid }, newAction);
        updatedAction.no_blame.description = 'Koele bedoening';

        return chai.request(app).put(`/v1/kiva/${id}/action/${aid}`)
            .send(updatedAction)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.all.keys([
                    '_id',
                    'type',
                    'no_blame',
                    'recovery_contract'
                ]);
                expect(res.body.no_blame.description).to.equal(updatedAction.no_blame.description);
            })
    });
});