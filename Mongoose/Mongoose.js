import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/moodleDB",{useNewUrlParser:true ,useCreateIndex:true ,useUnifiedTopology:true});

const adminSchema = {
    _id:String,
    name:String,
    surname:String,
    adminID:String,
    password:String
}

const teacherSchema = {
    _id:String,
    name:String,
    surname:String,
    teacherID:String,
    password:String,
    dept:String,
    deptname:String
}

const studentSchema = {
    _id:String,
    name:String,
    surname:String,
    studentID:String,
    password:String,
    dept:String,
    deptname:String
}

const departmentSchema = {
    _id:String,
    name:String
}

const materialSchema = {
    _id:String,
    name:String,
    teacherID:String,
    courseID:String,
    url:String
}

const courseSchema = {
    _id:String,
    courseName:String,
    enrollKey:String,
    teacherID:String,
}

const assignmentSchema = {
    _id:String,
    name:String,
    courseID:String,
    fileUrl:String,
    teacherID:String,
    submissionDate:Date,
    marks:String
}

const submissionSchema = {
    name:String,
    assignmentID:String,
    fileUrl:String,
    teacherID:String,
    submissionDate:Date,
    marks:String,
    studentID:String,
    feedback:String
}

const enrolleSchema = {
    studentID:String,
    courseID:String,
    teacherID:String,
    deptID:String
}

const quizSchema = {
    quizID:String,
    quizName:String,
    quizPassword:String,
    courseID:String,
    teacherID:String,
    deptID:String,
    quizData:Date,
    maxMarks:String,
    quizQuestions:Array,
    Duration:String,
    correctAns:Array,
    marksArr:Array
}

const attemptSchema = {
    studentID:String,
    teacherID:String,
    courseID:String,
    deptID:String,
    quizID:String,
    answers:Array,
    marks:String,
    violatedRule:Boolean
}

const evalSchema = {
    teacherID:String,
    courseID:String,
    deptID:String,
    quizID:String,
}

export const Admin = mongoose.model('admins',adminSchema);

export const Teacher = mongoose.model('teachers',teacherSchema);

export const Student = mongoose.model('students',studentSchema);

export const Department = mongoose.model('departments',departmentSchema);

export const Material = mongoose.model('materials',materialSchema);

export const Course = mongoose.model('courses',courseSchema);

export const Assignment = mongoose.model('assignments',assignmentSchema);

export const Enroll = mongoose.model('enrollments',enrolleSchema);

export const Submission = mongoose.model('submissions',submissionSchema);

export const Quiz = mongoose.model('quizes',quizSchema);

export const Attempt = mongoose.model('attempts',attemptSchema);

export const Eval = mongoose.model('evals',evalSchema);
