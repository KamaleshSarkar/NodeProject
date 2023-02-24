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
router.get("/showTable", upload.single("image"), adminController.showTable);
router.get("/delete/:id", adminController.delete);
router.get("/edit/:id", adminController.edit);

module.exports = router;
