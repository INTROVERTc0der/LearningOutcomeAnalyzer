import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Faculty from "../models/Faculty.model.js"
import Forms from "../models/Forms.model.js"
import Student from "../models/Student.model.js"
import { promisify } from 'util';

const registerFaculty = catchAsync(async (req, res, next) => {
  // Destructuring the necessary data from req object
  const { facultyId, name, username, post, instituteEmail, personalEmail, password, role } = req.body;

  // Check if the data is there or not, if not throw error message
  if (!facultyId || !name || !username || !post || !instituteEmail || !personalEmail || !password || !role) {
    return next(new AppError('All fields are required', 400));
  }
  console.log(instituteEmail);
  const userExist = await Faculty.find({ instituteEmail });
  console.log(userExist);
  if (userExist.length > 0) {
    return next(new AppError('user already exists', 400));
  }

  const newUser = await Faculty.create(req.body);
  console.log(newUser);

  // If all good send the response to the frontend
  res.status(201).json({
    message: 'User registered successfully',
    data: {
      data: newUser
    }
  });
});

const logoutFaculty = () => {

}
const getLoggedInUserDetails = () => {

}
const forgotPassword = () => {

}
const changePassword = () => {

}


const distributeForms = catchAsync(async (req, res, next) => {
  //if coursefeedback form then logic
  //const userId = req.session.userId;
  /* if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  } */

  
  const userId = req.params.id
  console.log(userId);
  const {f_type,f_name,batch} = req.body;
  if (!f_type || !batch) {
    return res.status(404).json({ message: 'Enter proper details' });

  }

  const newForm = await Forms.create({
    f_type,
    f_name,
    batch,
    faculty_id: userId
  });

  const students = await Student.find({ batch });

  students.forEach(students => {
    console.log(newForm);
    students.form_links.push(newForm);

    students.save();
  })

  const faculty = await Faculty.findById(userId);
  console.log(faculty.name);
  faculty.form_issued.push(newForm);
  faculty.save();

  res.status(201).json({
    status: 'form distributed successfully',
  });
});


const courses = ['Physics', 'Chemistry', 'Maths'];
const homePage = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const faculty = await Faculty.findById(id).populate('form_issued').exec();

    res.render('faculty', { faculty })
  }
);

export { logoutFaculty, getLoggedInUserDetails, forgotPassword, changePassword, registerFaculty, distributeForms, homePage }