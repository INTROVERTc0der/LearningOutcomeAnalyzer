import { Router } from "express";
import { registerStudent, getLoggedInUserDetails, logoutStudent, forgotPassword, changePassword } from '../controllers/student.controllers.js';
import { login } from "../controllers/authController.js";

const router = Router();
import Student from "../models/Student.model.js"

router.post("/register", registerStudent);
//router.post("/login",login);

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const student = await Student.findById(id).populate('form_links').exec();
    console.log(student);
    const forms = student.form_links;
    res.render('student', { student, forms });
})

router.post("/logout", logoutStudent);
router.get("/me", getLoggedInUserDetails);


export default router;