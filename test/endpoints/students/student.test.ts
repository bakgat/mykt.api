import * as mocha from 'mocha';
import * as chai from 'chai';
import * as mongoose from 'mongoose';

//import app from '../../../src/app';
import { Student } from '../../../src/students/student';

const expect = chai.expect;

describe('Student in MongoDb', () => {
    
    it('finds an array of students', () => {
        Student.find({}, (err, students) => {
            expect(students).to.be.an('array');
            expect(students).to.have.length(2);
        });
    });

    it('finds one student', () => {
        Student.findOne({ id: '1234' }, (err, student) => {
            if (err) throw err;

            expect(student).to.be.not.null;
            expect(student.first_name).to.equal('Karl');
            expect(student.last_name).to.equal('Van Iseghem');
        });
    });
});