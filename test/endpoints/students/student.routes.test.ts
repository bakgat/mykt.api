import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import chaiDatetime = require('chai-datetime');
import * as mongoose from 'mongoose';
import { Student } from '../../../src/students/student';
import { auth } from '../../../src/auth/index';

import app from '../../../src/app';


chai.use(chaiHttp).use(chaiDatetime);

const expect = chai.expect;

let studentGroupId = '58da4c423e17d80fc4c5f42e';
let studentId = '58da34163e17d80fc4c5f416'

let user = {
    username: 'frauke.taecke@klimtoren.be',
    password: 'password'
};

var token = '';
function _getToken(done): Promise<any> {
    return auth.login(user.username, user.password)
        .then(u => {
            token = u.token;
            done();
        });
}
function _getFaultyToken(done): Promise<any> {
    return auth.login('sophie.haelemeersch@klimtoren.be', 'password')
        .then(u => {
            token = u.token;
            done();
        });
}

describe('GET v1/students', () => {

    beforeEach(done => {
        _getToken(done);
    });

    it('responds with JSON array', () => {
        return chai.request(app).get('/v1/students')
            .set('x-access-token', token)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(2);
            });
    });

    it('should include Rebekka', () => {
        return chai.request(app).get('/v1/students')
            .set('x-access-token', token)
            .then(res => {
                let Rebekka = res.body.find(student => student.first_name == 'Rebekka');
                expect(Rebekka).to.exist;
                expect(Rebekka).to.have.keys([
                    'id',
                    '_id',
                    'first_name',
                    'last_name',
                    'birthday',
                    'school_id'
                ]);
            });
    });

});

describe('Check authorization', () => {
    beforeEach(done => { _getFaultyToken(done); });

    it('should allow on get list for Sophie', () => {
        return chai.request(app).get('/v1/students')
            .set('x-access-token', token)
            .then(res => {
                expect(res).to.have.status(200);
            });
    });
    it('should not allow delete student for Sophie', () => {
        return chai.request(app).del(`/v1/students/${studentId}`)
            .set('x-access-token', token)
            .catch(err => {
                expect(err).to.have.status(403);
            });
    });
});


describe('GET v1/students/:id', () => {
    beforeEach(done => {
        _getToken(done);
    });

    it('responds with a single JSON object', () => {
        return chai.request(app).get('/v1/students/58d528003e17d80fc4c5f410')
            .set('x-access-token', token)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
            });
    });

    it('should return Karl', () => {
        return chai.request(app).get(`/v1/students/${studentId}`)
            .set('x-access-token', token)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.first_name).to.equal('Karl');
                expect(res.body.last_name).to.equal('Van Iseghem');
                expect(res.body.school_id).to.equal('0000001');
            });
    });
    it('responds with 404 when not found', () => {
        return chai.request(app).get('/v1/students/60da67d410cb3b7a18e11716')
            .set('x-access-token', token)
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
    it('responds with 500 when no ObjectId is passed', () => {
        return chai.request(app).get('/v1/students/foo')
            .set('x-access-token', token)
            .catch(res => {
                expect(res).to.have.status(500);
            });
    });
});

describe('POST v1/students', () => {
    let newStudent = {
        first_name: 'New',
        last_name: 'Student',
        school_id: '0000003',
        birthday: new Date('1979/11/30')
    };

    beforeEach(done => { _getToken(done) });

    afterEach(done => {
        Student.find({ 'first_name': 'New' }).remove().exec();
        done();
    });

    it('should add new student', () => {
        return chai.request(app).post('/v1/students')
            .set('x-access-token', token)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(newStudent)
            .then(res => {
                expect(res).to.have.status(201);
                let id = res.body._id;
                expect(res).to.have.header('location', `/v1/students/${id}`);
                expect(res).to.be.json;
                //must return newly created student
                expect(res.body).to.contain.all.keys(['_id']);
                expect(res.body.first_name).to.equal(newStudent.first_name);
                expect(res.body.last_name).to.equal(newStudent.last_name);
                expect(res.body.school_id).to.equal(newStudent.school_id);
            });
    });
});

describe('PUT v1/students/58da34163e17d80fc4c5f416', () => {
    var original = null;
    let updated = {
        first_name: 'updated',
        last_name: 'student',
        school_id: '0000004'
    }
    beforeEach(done => {
        Student.findById('58da34163e17d80fc4c5f416')
            .then(student => {
                delete student._id;
                original = student;
                _getToken(done);
            });
    });
    afterEach(done => {
        Student.findByIdAndUpdate('58da34163e17d80fc4c5f416', { $set: original })
            .then(() => {
                done();
            });

    });

    it('should update existing student', () => {

        return chai.request(app).put('/v1/students/58da34163e17d80fc4c5f416')
            .set('x-access-token', token)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(updated)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body._id).to.equal('58da34163e17d80fc4c5f416');
                expect(res.body.first_name).to.equal(updated.first_name);
                expect(res.body.last_name).to.equal(updated.last_name);
                expect(res.body.school_id).to.equal(updated.school_id);
            });
    });

    it('responds with 404 when not found', () => {
        return chai.request(app).put('/v1/students/60da67d410cb3b7a18e11716')
            .set('x-access-token', token)
            .send(updated)
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
});

describe('DELETE v1/students/:id', () => {
    var student;
    beforeEach(done => {
        let data = {
            first_name: 'ToDelete',
            last_name: ':-)'
        }
        student = new Student(data);
        student.save()
            .then(() => {
                _getToken(done);
            });
    });

    it('should remove the new object', () => {
        return chai.request(app).del(`/v1/students/${student._id}`)
            .set('x-access-token', token)
            .then(res => {
                expect(res).to.have.status(204);
            });
    });
});

describe('DELETE v1/students/foo', () => {
    beforeEach(done => { _getToken(done); });
    it('responds with 404 when not found', () => {
        return chai.request(app).del('/v1/students/60da67d410cb3b7a18e11716')
            .set('x-access-token', token)
            .catch(res => {
                expect(res).to.have.status(404);
            });
    });
});

describe('GET v1/students/58da34163e17d80fc4c5f416/groups', () => {
    beforeEach(done => { _getToken(done); });

    it('responds with a json array', () => {
        return chai.request(app).get('/v1/students/58da34163e17d80fc4c5f416/groups')
            .set('x-access-token', token)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.length(2);
            });
    });
    it('should include Lambik from 2015/09/01 until 2016/06/30', () => {
        return chai.request(app).get('/v1/students/58da34163e17d80fc4c5f416/groups')
            .set('x-access-token', token)
            .then(res => {
                let Lambik = res.body.find(group => group.name == 'Lambik');
                expect(Lambik).to.exist;
                expect(new Date(Lambik.start)).to.equalDate(new Date('2015-09-01'));
                expect(new Date(Lambik.end)).to.equalDate(new Date('2016-06-30'));
            });
    });
});

describe('POST v1/students/58da34163e17d80fc4c5f416/groups', () => {
    let data = {
        group: { _id: '58d6e2e63e17d80fc4c5f411' },
        start: new Date('2014-09-01'),
        end: new Date('2015-06-30')
    };

    beforeEach(done => { _getToken(done); });

    afterEach(done => {
        Student.findByIdAndUpdate('58da34163e17d80fc4c5f416',
            {
                $pull: {
                    groups:
                    {
                        group_id: mongoose.Types.ObjectId('58d6e2e63e17d80fc4c5f411'),
                        start: new Date('2014-09-01'),
                        end: new Date('2015-06-30')
                    }
                }
            }).exec(() => {
                done();
            });
    });

    it('should add a student to a group and return group added', () => {
        return chai.request(app).post('/v1/students/58da34163e17d80fc4c5f416/groups')
            .set('x-access-token', token)
            .send(data)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.all.keys([
                    '_id',
                    'group_id',
                    'name',
                    'start',
                    'end'
                ])
            });
    });
});

describe(`PUT v1/students/${studentId}/groups/${studentGroupId}`, () => {
    var original = null;
    let end = new Date();
    beforeEach(done => {
        Student.findById(studentId)
            .then(student => {
                original = student.groups.find(group => group._id.toString() == studentGroupId);
                _getToken(done);
            });
    });
    afterEach(done => {
        if (original) {
            delete original._id;
            Student.findOneAndUpdate({ 'groups._id': studentGroupId },
                { $set: { 'groups.$': original } })
                .then(() => {
                    done();
                });
        } else {
            done();
        }
    });
    let data = {
        start: new Date('2016-09-01'),
        end: end
    }
    it('should update the group subscription', () => {

        return chai.request(app).put(`/v1/students/${studentId}/groups/${studentGroupId}`)
            .set('x-access-token', token)
            .send(data)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(new Date(res.body.end)).to.equalDate(end)
            });
    });
});

describe(`DELETE v1/students/${studentId}/groups/:id`, () => {
    var group = null;
    let data = {
        _id: new mongoose.Types.ObjectId,
        name: 'TestGroup',
        start: new Date()
    };
    beforeEach(done => {
        Student.findByIdAndUpdate(studentId,
            { $push: { groups: data } })
            .then(result => {
                group = result.groups.find(g => g.group_id == data._id.toString())
                _getToken(done);
            });
    });

    it('should remove a group subscription', () => {
        return chai.request(app).del(`/v1/students/${studentId}/groups/${data._id}`)
            .set('x-access-token', token)
            .then(res => {
                expect(res).to.have.status(204);
            });
    })
});


