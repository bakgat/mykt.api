import * as mongoose from 'mongoose';
import { Student, IStudent } from './student';
import { Group, IStudentGroup } from '../groups/group';
import { GenericCrudService } from '../abstract/crud.service';

export class StudentService extends GenericCrudService<IStudent> {
    constructor() {
        super();
        this._model = Student;
        this._select = '-groups'; //do not include groups field in response
    }

    getGroups(id: string): Promise<Array<IStudentGroup>> {
        return Student.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(id) } },
            { $unwind: '$groups' },
            {
                $project: {
                    _id: '$groups._id',
                    group_id: '$groups.group_id',
                    start: '$groups.start',
                    end: '$groups.end',
                    name: '$groups.name'
                }
            }
        ])
            .exec();
    }

    addToGroup(id: string, groupId: string, start: Date, end?: Date): Promise<IStudentGroup> {
        let promise = new Promise<IStudentGroup>((resolve, reject) => {
            //first find group details
            Group.findById(groupId)
                .then(group => {
                    let data: IStudentGroup = {
                        _id: new mongoose.Types.ObjectId,
                        group_id: group._id,
                        name: group.name,
                        start: start,
                        end: end
                    }

                    //get student by it's id
                    this.getOne(id)
                        .then(student => {
                            //add group data to groups array
                            student.groups.push(data);
                            student.save()
                                .then(result => { resolve(data); })
                                .catch(err => { reject(err); });
                        })
                        .catch(err => { reject(err); });
                })
                .catch(err => { reject(err); });
        });
        return promise;
    }

    updateGroupSubscription(studentGroupId: string, start: Date, end?: Date): Promise<IStudentGroup> {
        let promise = new Promise<IStudentGroup>((resolve, reject) => {
            Student.findOneAndUpdate({ 'groups._id': studentGroupId },
                {
                    $set: {
                        'groups.$.start': start,
                        'groups.$.end': end
                    }
                },
                { new: true })
                .then(student => {
                    resolve(student.groups.find(group => group._id.toString() == studentGroupId))
                })
                .catch(err => reject(err));
        });
        return promise;
    }

    removeGroupSubscription(studentId, studentGroupId): Promise<IStudent> {
        return Student.findByIdAndUpdate(studentId,
            { $pull: { groups: { '_id': mongoose.Types.ObjectId(studentGroupId) } } })
            .exec();
    }
}


export const studentService = new StudentService();