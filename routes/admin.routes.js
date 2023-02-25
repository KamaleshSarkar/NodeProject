const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        " " +
        Date.now() +
        "myimg" +
        path.extname(file.originalname)
    );
  },
});

const maxSize = 1 * 1024 * 1024;

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only jpg,png and jpeg type are allowed"));
    }
  },
  limits: maxSize,
});

router.get("/", adminController.logIn);
router.post("/get-LogIn", adminController.getLogin);
router.get("/register", adminController.register);
router.post(
  "/get-Register",
  upload.single("image"),
  adminController.getRegister
);
router.get("/dashboard", adminController.userAuth, adminController.dashboard);
router.get("/template", adminController.template);
router.get("/logout", adminController.logout);




//<Add user Part.....!>
router.get('/addData',adminController.addData)
router.post('/saveData',upload.single("image"),adminController.saveData)
router.get("/showTable", upload.single("image"), adminController.showTable);
router.post("/updateData", upload.single("image"), adminController.updateData);
router.get("/delete/:id", adminController.delete);
router.get("/edit/:id", adminController.edit);



//< FAQ Parts....>
router.get('/showFAQ',adminController.showFAQ)
router.get('/questionFAQ',adminController.questionFAQ)
router.post('/saveQuestion',adminController.saveQuestion)
router.get("/delete-Question/:id", adminController.deleteQuestion);


//< Blog Parts.....!>
router.get('/showBlog',adminController.showBlog)
router.get('/blogAdd',adminController.blogAdd)
router.post('/save-Blog-Content',upload.single("image"),adminController.saveBlogContent)
router.get('/deleteBlog/:id',adminController.deleteBlog)



module.exports = router;
