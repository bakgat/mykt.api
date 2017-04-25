import * as chai from 'chai';
import { staffService } from '../../../src/staff/index';

let expect = chai.expect;

describe('Find Staff by it\'s username', () => {
    it('should return a, IStaff promise', () => {
        return staffService.findByUsername('frauke.taecke@klimtoren.be')
            .then(staff => {
                expect(staff).to.exist;
                expect(staff.first_name).to.equal('Frauke');
                expect(staff.last_name).to.equal('Taecke');
            });
    });
});