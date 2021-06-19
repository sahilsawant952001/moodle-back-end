//IMPORTS
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { Admin, Assignment, Attempt, Course, Department, Enroll, Eval, Material, Quiz, Student, Submission, Teacher } from "./Mongoose/Mongoose.js";

//APP
const app = express();

//MIDDLEWARES
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

//FUNCTION TO GET DEPARTMENT NAME
const getDeptName = (dept) => {
    let deptname = null;
    if(dept==='CSE'){
        deptname = 'COMPUTER SCIENCE';
    }else if(dept==='IT'){
        deptname = 'INFORMATION TECHNOLOGY';
    }else if(dept==='EXTC'){
        deptname = 'ELECTRONICS AND TELECOMMUNICATION';
    }else if(dept==='ETRX'){
        deptname = 'ELECTRONICS';
    }
    return deptname;
}

//SIGNUP API FOR ADMIN
app.post('/Admin/SignUp',(req,res) => {
    bcrypt.hash(req.body.password,3,(err,hash) => {
        const newAdmin = new Admin({
            _id:req.body.email,
            name:req.body.name,
            surname:req.body.surname,
            adminID:req.body.adminID,
            password:hash
        });

        newAdmin.save((err,data) => {
            if(err){
                res.send({
                    authenticatedUser:false,
                    message:'Admin With This Email Address Already Exists',
                    error:err
                })
            }else{
                res.send({
                    authenticatedUser:true,
                    message:'Signup Successfull',
                    id:data.adminID,
                    name:data.name,
                    surname:data.surname,
                })
            }
        })
    })
})

//SIGN UP API FOR TEACHER
app.post('/Teacher/SignUp',(req,res) => {
    bcrypt.hash(req.body.password,3,(err,hash) => {
        const newTeacher = new Teacher({
            _id:req.body.email,
            name:req.body.name,
            surname:req.body.surname,
             teacherID:req.body. teacherID,
            password:hash,
            dept:req.body.dept,
        });

        let deptname = getDeptName(req.body.dept);

        newTeacher.save((err,data) => {
            if(err){
                res.send({
                    authenticatedUser:false,
                    message:'Account Already Exists',
                    error:err
                })
            }else{
                res.send({
                    authenticatedUser:true,
                    message:'Signup Successfull',
                    id:data. teacherID,
                    name:data.name,
                    surname:data.surname,
                    dept:data.dept,
                    deptname:deptname
                })
            }
        })  
    })
})

//SIGN UP API FOR STUDENT
app.post('/Student/SignUp',(req,res) => {
    bcrypt.hash(req.body.password,3,(err,hash) => {
        const newStudent = new Student({
            _id:req.body.email,
            name:req.body.name,
            surname:req.body.surname,
            studentID:req.body.studentID,
            password:hash,
            dept:req.body.dept,
        });

        let deptname = getDeptName(req.body.dept);

        newStudent.save((err,data) => {
            if(err){
                res.send({
                    authenticatedUser:false,
                    message:'Account Already Exists',
                    error:err
                })
            }else{
                res.send({
                    authenticatedUser:true,
                    message:'Signup Successfull',
                    id:data.studentID,
                    name:data.name,
                    surname:data.surname,
                    dept:data.dept,
                    deptname:deptname
                })
            }
        })  
    })
})

//SIGN IN API FOR ADMIN
app.post('/Admin/SignIn',(req,res) => {
    
    const email = req.body.email;
    const password = req.body.password;
    Admin.findOne({_id:email},function(err,user){
        if(err){
            res.send({
                authenticatedUser:false,
                message:"Something Went Wrong !"
            });
        }else if(err===null && user===null){
            res.send({
                authenticatedUser:false,
                message:"Entered UserID Not Found"
            })
        }
        else{
            
            bcrypt.compare(password, user.password, function(err, result) {
                
                if(result===true){
                    res.send({
                        authenticatedUser:true,
                        message:'Signin Successfull',
                        id:user.adminID,
                        name:user.name,
                        surname:user.surname,
                    })
                }else{
                    res.send({
                        authenticatedUser:false,
                        message:"Incorrect Password"
                    });
                }
            });
        }
    })
})

//SIGN IN API FOR TEACHER
app.post('/Teacher/SignIn',(req,res) => {
    
    const email = req.body.email;
    const password = req.body.password;
    Teacher.findOne({_id:email},function(err,user){
        if(err){
            res.send({
                authenticatedUser:false,
                message:"Something Went Wrong !"
            });
        }else if(err===null && user===null){
            res.send({
                authenticatedUser:false,
                message:"Entered UserID Not Found"
            })
        }
        else{
            
            let deptname = getDeptName(user.dept);

            bcrypt.compare(password, user.password, function(err, result) {
                if(result===true){
                    res.send({
                        authenticatedUser:true,
                        message:'Signin Successfull',
                        id:user. teacherID,
                        name:user.name,
                        surname:user.surname,
                        dept:user.dept,
                        deptname:deptname
                    })
                }else{
                    res.send({
                        authenticatedUser:false,
                        message:"Incorrect Password"
                    });
                }
            });
        }
    })
})

//SIGN IN API FOR STUDENT
app.post('/Student/SignIn',(req,res) => {
    
    const email = req.body.email;
    const password = req.body.password;
    Student.findOne({_id:email},function(err,user){
        if(err){
            res.send({
                authenticatedUser:false,
                message:"Something Went Wrong !"
            });
        }else if(err===null && user===null){
            res.send({
                authenticatedUser:false,
                message:"Entered UserID Not Found"
            })
        }
        else{
            
            let deptname = getDeptName(user.dept);

            bcrypt.compare(password, user.password, function(err, result) {
                if(result===true){
                    res.send({
                        authenticatedUser:true,
                        message:'Signin Successfull',
                        id:user.studentID,
                        name:user.name,
                        surname:user.surname,
                        dept:user.dept,
                        deptname:deptname
                    })
                }else{
                    res.send({
                        authenticatedUser:false,
                        message:"Incorrect Password"
                    });
                }
            });
        }
    })
})

//API FOR REMOVING TEACHER
app.post('/Admin/RemoveTeacher',(req,res) => {
    const id = req.body.email;
    Teacher.deleteOne({_id:id},(err,success) => {
        if(err){
            res.send({
                success:false,
                message:"FAILED TO DELETE TEACHER"
            });
        }else{
            if(success.deletedCount===1){
                res.send({
                    success:true,
                    message:"SUCCESSFULLY DELETED TEACHER"
                });
            }else{
                res.send({
                    success:false,
                    message:"FAILED TO DELETE TEACHER"
                });
            }
        }
    })
})

//API FOR REMOVING STUDENT
app.post('/Admin/RemoveStudent',(req,res) => {
    const id = req.body.email;
    Student.deleteOne({_id:id},(err,success) => {
        if(err){
            res.send({
                message:"FAILED TO DELETE STUDENT"
            });
        }else{
            if(success.deletedCount===1){
                res.send({
                    message:"SUCCESSFULLY DELETED STUDENT"
                });
            }else{
                res.send({
                    message:"FAILED TO DELETE STUDENT"
                });
            }
        }
    })
})

//API TO REMOVE DEPARTMENT
app.post('/Admin/RemoveDepartment',(req,res) => {
    const id = req.body.id;
    Department.deleteOne({_id:id},(err,success) => {
        if(err){
            res.send({
                success:false,
                message:"FAILED TO DELETE DEPARTMENT"
            });
        }else{
            if(success.deletedCount){
                res.send({
                    success:true,
                    message:"SUCCESSFULLY DELETED DEPARTMENT"
                });
            }else{
                res.send({
                    success:false,
                    message:"FAILED TO DELETE DEPARTMENT"
                });
            }
        }
    })
})

//API TO ADD DEPARTMENT
app.post('/Admin/AddDepartment',(req,res) => {
    const id = req.body.id;
    const name = req.body.name;
    const newDepartment = new Department({
        _id:id,
        name:name
    })
    newDepartment.save((err,data) => {
        if(err!==null){
            res.send({
                success:false,
                message:'FAILED TO ADD DEPARTMENT',
                error:err
            })
        }else{
            res.send({
                success:true,
                message:'SUCCESSFULLY ADDED DEPARTMENT',
            })
        }
    })
})


app.post('/Teacher/UploadMaterial',(req,res) => {
    
    const newMaterial = new Material({
        _id:req.body._id,
        name:req.body.name,
         teacherID:req.body. teacherID,
        courseID:req.body.courseID,
        url:req.body.url
    });

    newMaterial.save((err,data) => {
        if(err){
            res.send({
                success:false,
                message:'FAILED TO UPLOAD STUDY MATERIAL'
            });
        }else{
            res.send({
                success:true,
                message:'SUCCESSFULLY UPLOADED STUDY MATERIAL'
            });
        }
    })

})


//API TO GET ALL TEACHERS IN ANY DEPARTMENT
app.post('/GetTeachers',(req,res) => {
    const dept = req.body.dept;
    const options = {
        password:false,
        __v:false
    }
    Teacher.find({dept:dept},options,(err,data) => {
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    })
})

//API FOR TEACHER TO CREATE COURSE 
app.post('/CreateCourse',(req,res) => {
    const courseID = req.body.courseID;
    const courseName = req.body.courseName;
    const enrollKey = req.body.enrollKey;
    const  teacherID = req.body. teacherID;

    const newCourse = new Course({
        _id:courseID,
        courseName:courseName,
        enrollKey:enrollKey,
         teacherID: teacherID
    });

    newCourse.save((err,data) => {
        if(err){
            res.send({
                err:err,
                success:false,
                message:'FAILED TO CREATE COURSE'
            })
        }else{
            res.send({
                success:true,
                message:'SUCCESSFULLY CREATED COURSE'
            })
        }
    })
})

//API TO VIEW ALL COURSES FOR TEACHER
app.post('/AllCourses',(req,res) => {
    const  teacherID = req.body. teacherID;
    Course.find({ teacherID: teacherID},null,(err,data) => {
        if(err){
            res.send({
                err:err,
                success:false,
                message:'FAILED TO FETCH COURSES'
            })
        }else{
            res.send({
                success:true,
                message:'SUCCESSFULLY FETCHED COURSES',
                courses:data
            })
        }
    })
})


//API TO GET MATERIAL
app.post('/GetMaterial',(req,res) => {
    const courseID = req.body.courseID;
    const  teacherID = req.body.teacherID;
    Material.find({courseID:courseID, teacherID: teacherID},(err,data) => {
        if(err){

            res.send({
                err:err,
                success:false,
                message:'FAILED TO FETCH MATERIAL'
            })
        }else{
            res.send({
                err:err,
                success:true,
                message:'SUCCESSFULLY FETCHED MATERIAL',
                data:data
            })
        }
    })
})

//API TO CREATE ASSIGNMENT
app.post('/AddAssignment',(req,res) => {
    const id = req.body.id;
    const name = req.body.name;
    const courseID = req.body.courseID;
    const fileUrl = req.body.fileUrl;
    const date = req.body.submissionDate;
    const marks = req.body.marks;
    const teacherID = req.body.teacherID

    const newAssignment = new Assignment({
        _id:id,
        name:name,
        courseID:courseID,
        fileUrl:fileUrl,
        submissionDate:date,
        marks:marks,
        teacherID:teacherID
    })

    newAssignment.save((err,data) => {
        if(err){
            res.send({
                err:err,
                success:false,
                message:'FAILED TO CREATE ASSIGNMENT'
            })
        }else{
            res.send({
                success:true,
                message:'ASSIGNMENT CREATED'
            })
        }
    })    
})

app.post('/GetAssignments',(req,res) => {
    const courseID = req.body.courseID;
    const  teacherID = req.body. teacherID;
    Assignment.find({
        courseID:courseID,
         teacherID: teacherID
    },(err,data) => {
        if(err){
            res.send({
                err:err,
                success:false,
                message:'FAILED TO FETCH ASSIGNMENTS'
            })
        }else{
            res.send({
                success:true,
                message:'FETCHED ALL ASSIGNMENTS',
                data:data
            })
        }
    })
})

app.post('/Student/AddSubmission',(req,res) => {
    const name = req.body.name;
    const assignmentID = req.body.assignmentID;
    const fileUrl = req.body.fileUrl;
    const date = req.body.submissionDate;
    const marks = "NG";
    const teacherID = req.body.teacherID;
    const studentID = req.body.studentID;


    const newSubmission = new Submission({
        name:name,
        assignmentID:assignmentID,
        fileUrl:fileUrl,
        submissionDate:date,
        marks:marks,
        teacherID:teacherID,
        studentID:studentID,
        feedback:""
    })

    newSubmission.save((err,data) => {
        if(err){
            res.send({
                err:err,
                success:false,
                message:'FAILED TO ADD SUBMISSION'
            })
        }else{
            res.send({
                success:true,
                message:'ADDED SUBMISSION SUCCESSFULLY'
            })
        }
    })
})

app.post('/GetSubmissionStatus',(req,res) => {
    const studentID = req.body.studentID;
    const assignmentID = req.body.assignmentID;
    const teacherID = req.body.teacherID;

    Submission.find({
        studentID:studentID,
        assignmentID:assignmentID,
        teacherID:teacherID
    },(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'SOME ERROR OCCURED'
            })
        }else{
            if(data.length!==0){
                res.send({
                    success:true,
                    message:'ASSIGNMNET SUBMITTED',
                    data:data
                })
            }else{
                res.send({
                    success:false,
                    message:'ASSIGNMENT NOT SUBMITTED'
                })
            }
        }
    })
})

app.post('/Student/UpdateSubmission',(req,res) => {
    const studentID = req.body.studentID;
    const assignmentID = req.body.assignmentID;
    const teacherID = req.body.teacherID;
    const fileUrl = req.body.fileUrl;
    const newDate = new Date();
    const name = req.body.name;

    Submission.updateOne({
        studentID:studentID,
        assignmentID:assignmentID,
        teacherID:teacherID
    },{
        fileUrl:fileUrl,
        submissionDate:newDate,
        name:name
    },(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'SOME ERROR OCCURED'
            })
        }else{
            if(data.nModified===1){
                res.send({
                    success:true,
                    message:'SUCCESSFULLY UPDATED SUBMISSION'
                })
            }else{
                res.send({
                    success:false,
                    message:'FAILED TO UPDATE SUBMISSION'
                })
            }
        }
    })
})

app.post('/Teacher/GetSubmissions',(req,res) => {
    const teacherID = req.body.teacherID;
    const assignmentID = req.body.assignmentID;

    Submission.find({
        teacherID:teacherID,
        assignmentID:assignmentID
    },(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'FAILED TO FETCH SUBMISSIONS'
            })
        }else{
            if(data.length===0){
                res.send({
                    success:false,
                    message:'FAILED TO FETCH SUBMISSIONS'
                })
            }else{
                res.send({
                    success:true,
                    message:'SUCCESSFULLY FETCHED SUBMISSIONS',
                    data:data
                })
            }
        }
    })
})

app.post('/Teacher/Evaluate',(req,res) => {
    console.log(req.body);
    const teacherID = req.body.teacherID;
    const assignmentID = req.body.assignmentID;
    const studentID = req.body.studentID;
    const marks = req.body.marks;
    const feedback = req.body.feedback;

    console.log(teacherID,assignmentID,studentID,marks,feedback);

    Submission.updateOne({
        teacherID:teacherID,
        assignmentID:assignmentID,
        studentID:studentID
    },{
        marks:marks,
        feedback:feedback
    },(err,data) => {
        console.log(err);
        if(err){
                console.log(err)
                res.send({
                    success:false,
                    message:'FAILED TO UPDATE MARKS'
                })
        }else{
            console.log(data);
            if(data.nModified===1){
                res.send({
                    success:true,
                    message:'SUCCESSFULLY UPDATED MARKS'
                })
            }else{
                res.send({
                    success:false,
                    message:'FAILED TO UPDATE MARKS'
                })
            }
        }
    })
})

app.post('/Student/EnrollStatus',(req,res) => {
    
    const deptID = req.body.deptID;
    const studentID = req.body.studentID;
    const teacherID = req.body.teacherID;
    const courseID = req.body.courseID;

    Enroll.find({
        courseID:courseID,
        studentID:studentID,
        teacherID:teacherID,
        deptID:deptID
    },(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'FAILED TO FIND ENROLLMENT STATUS'
            })
        }else{
            if(data.length===0){
                res.send({
                    success:false,
                    message:'NOT ENROLLED'
                })
            }else{
                res.send({
                    success:true,
                    message:'ALREADY ENROLLED'
                })
            }
        }
    })
})

app.post('/Student/Enroll',(req,res) => {

    const deptID = req.body.deptID;
    const studentID = req.body.studentID;
    const teacherID = req.body.teacherID;
    const courseID = req.body.courseID;

    const newEnroll = new Enroll({
        courseID:courseID,
        studentID:studentID,
        teacherID:teacherID,
        deptID:deptID
    })
    
    newEnroll.save((err1,success) => {
        if(err1){
            res.send({
                success:false,
                message:'ENROLLMENT UNSUCCESSFUL'
            })
        }else{
            res.send({
                success:true,
                message:'ENROLLMENT SUCCESSFUL'
            })
        }
    })
})

app.post('/Teacher/AddQuiz',(req,res) => {
    const quizID = req.body.quizID;
    const quizName = req.body.quizName;
    const quizPassword = req.body.quizPassword;
    const courseID = req.body.courseID;
    const teacherID = req.body.teacherID;
    const deptID = req.body.deptID;
    const quizDate = req.body.quizDate;
    const maxMarks = req.body.maxMarks;
    const quizQuestions = req.body.quizQuestions;
    const Duration = req.body.Duration;
    const quizAns = req.body.quizAns;
    const quizAnsMarks = req.body.quizAnsMarks;

    const newQuiz = new Quiz({
        quizID:quizID,
        quizName:quizName,
        quizPassword:quizPassword,
        courseID:courseID,
        teacherID:teacherID,
        deptID:deptID,
        quizDate:quizDate,
        Duration:Duration,
        maxMarks:maxMarks,
        quizQuestions:quizQuestions,
        correctAns:quizAns,
        marksArr:quizAnsMarks
    })

    newQuiz.save((err,data) => {
        if(err){
            res.send({
                success:false,
                message:'FAILED TO CREATE QUIZ'
            })
        }else{
            res.send({
                success:true,
                message:'SUCCESSFULLY CREATED QUIZ',
                data:data
            })
        }
    })
})

app.post('/Teacher/GetQuizes',(req,res) => {
    const courseID = req.body.courseID;
    const teacherID = req.body.teacherID;
    const deptID = req.body.deptID;

    Quiz.find({
        teacherID:teacherID,
        deptID:deptID,
        courseID:courseID
    },(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'FAILED TO FETCH QUIZES'
            })
        }else{
            if(data!==null){
                res.send({
                    success:true,
                    message:'SUCCESSFULLY FETCHED QUIZES',
                    data:data
                })
            }else{
                res.send({
                    success:true,
                    message:'FAILED TO FETCH QUIZES'
                })
            }
        }
    })
})

app.post('/Student/GetQuizes',(req,res) => {
    const courseID = req.body.courseID;
    const teacherID = req.body.teacherID;
    const deptID = req.body.deptID;

    const options = {
        correctAns:false
    }

    Quiz.find({
        teacherID:teacherID,
        deptID:deptID,
        courseID:courseID
    },options,(err,data) => {
        console.log(data);
        if(err){
            res.send({
                success:false,
                message:'FAILED TO FETCH QUIZES'
            })
        }else{
            if(data!==null){
                res.send({
                    success:true,
                    message:'SUCCESSFULLY FETCHED QUIZES',
                    data:data
                })
            }else{
                res.send({
                    success:true,
                    message:'FAILED TO FETCH QUIZES'
                })
            }
        }
    })
})

app.post('/Student/CheckAttempt',(req,res) => {

    const studentID = req.body.studentID;
    const teacherID = req.body.teacherID;
    const courseID = req.body.courseID;
    const deptID = req.body.deptID;
    const quizID = req.body.quizID;


    Attempt.find({
        studentID:studentID,
        teacherID:teacherID,
        courseID:courseID,
        deptID:deptID,
        quizID:quizID
    },(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'FAILED TO SUBMIT ATTEMPT'
            })
        }else{
            if(data.length!==0){
                res.send({
                    success:false,
                    message:'ATTEMPT FOUND'
                })
            }else{
                res.send({
                    success:true,
                    message:'YOU CAN ATTEMPT'
                })
            }
        }
    })
})

app.post('/Student/Attempt',(req,res) => {

    const studentID = req.body.studentID;
    const teacherID = req.body.teacherID;
    const courseID = req.body.courseID;
    const deptID = req.body.deptID;
    const quizID = req.body.quizID;
    const answers = req.body.answers;
    const violatedRule = req.body.violatedRule;

    let d,m = null;

    Quiz.find({
        teacherID:teacherID,
        courseID:courseID,
        deptID:deptID,
        quizID:quizID,
    },(err,found,d) => {
        if(!err){
            d = found[0].correctAns;
            m = found[0].marksArr;
            let marks = 0;
            for(let i=0;i<answers.length;i++)
            {
                if(d[i]===answers[i]){
                    marks=marks+parseInt(m[i]);
                    console.log(marks);
                }
            }
            const newAttempt = new Attempt({
                studentID:studentID,
                teacherID:teacherID,
                courseID:courseID,
                deptID:deptID,
                quizID:quizID,
                answers:answers,
                marks:marks,
                violatedRule:violatedRule
            })
        
            newAttempt.save((err,data) => {
                if(err){
                    res.send({
                        success:false,
                        message:'FAILED TO SUBMIT ATTEMPT'
                    })
                }else{
                    if(data!==null){
                        res.send({
                            success:true,
                            message:'SUCCESSFULLY SUBMITTED ATTEMPT'
                        })
                    }else{
                        res.send({
                            success:false,
                            message:'FAILED TO SUBMIT ATTEMPT'
                        })
                    }
                }
            })      
        }
    })
})

app.post('/Teacher/AllAttempts',(req,res) => {
    const teacherID = req.body.teacherID;
    const courseID = req.body.courseID;
    const deptID = req.body.deptID;
    const quizID = req.body.quizID;
    let quizData = null;

    Quiz.find({
        teacherID:teacherID,
        courseID:courseID,
        deptID:deptID,
        quizID:quizID
    },(err,data) => {
        if(err){
            res.send({
                success:false,
                message:'Quiz Not Found'
            })
        }else{
            if(data.length===0){
                res.send({
                    success:false,
                    message:'Quiz Not Found'
                })
            }else{
                quizData = data;
                    Attempt.find({
                        teacherID:teacherID,
                        courseID:courseID,
                        deptID:deptID,
                        quizID:quizID    
                },(err,data2) => {
                    if(err){
                        res.send({
                            success:false,
                            message:'Quiz Not Found'
                        })
                    }else{
                        if(data2.length===0){
                            res.send({
                                success:true,
                                message:'No Attempts Yet'
                            })
                        }else{
                            res.send({
                                success:true,
                                message:'Attempts Found',
                                quizInfo:quizData,
                                attemptInfo:data2
                            })
                        }
                    }
                })
            }
        }
    })
})

app.listen(4000,() => {
    console.log('SERVER STARTED AT PORT 4000');
})

    