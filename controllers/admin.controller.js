const adminModel = require("../models/admin.model");
const userDataModel = require("../models/userData.model");
const faqModel = require("../models/faq.model");
const blogModel = require("../models/blog.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
class AdminController {
  /**
   * @Method userAuth
   * @Description To check Authentic User
   */
  async userAuth(req, res, next) {
    try {
      if (req.user) {
        next();
      } else {
        res.redirect("/");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @Method showIndex
   * @Description To Show The Index Page / Login Page
   */
  async logIn(req, res) {
    try {
      res.render("admin/index", {
        title: "Admin || Login",
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method dashboard
   * @Description To Show The Dashboard
   */
  async dashboard(req, res) {
    try {
      console.log(req.user);
      res.render("admin/dashboard", {
        title: "Admin || Dashboard",
        user: req.user,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method template
   * @Description Basic Template
   */
  async template(req, res) {
    try {
      res.render("admin/template", {
        title: "Admin || Template",
      });
    } catch (err) {
      throw err;
    }
  }
  /**
   * @Method Register
   * @Description To render Register Page
   */
  async register(req, res) {
    try {
      res.render("admin/register", {
        title: "Admin || Register",
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method: Get-Register
   * @description: To Save Registration Data
   */

  async getRegister(req, res) {
    try {
      // console.log(req.file);
      req.body.image = req.file.filename;

      let isEmailExist = await adminModel.findOne({ email: req.body.email });
      if (!isEmailExist) {
        if (req.body.password === req.body.confirmPassword) {
          req.body.password = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10)
          );
          let saveData = await adminModel.create(req.body);
          if (saveData && saveData._id) {
            // console.log(saveData);
            console.log("Register...");
            res.redirect("/");
          } else {
            console.log("Not registered");
            res.redirect("/register");
          }
        } else {
          console.log("Password and confirm password does not match");
          res.redirect("/register");
        }
      } else {
        console.log("Email already exists");
        res.redirect("/register");
      }
    } catch (error) {
      throw error;
    }
  }
  /**
   * @Method: Get-Login
   * @Description: To Save LogIn  Data
   */

  async getLogin(req, res) {
    try {
      let isUserExists = await adminModel.findOne({
        email: req.body.email,
      });
      if (isUserExists) {
        const hashPassword = isUserExists.password;
        if (bcrypt.compareSync(req.body.password, hashPassword)) {
          //token creation

          const token = jwt.sign(
            {
              id: isUserExists._id,
              email: isUserExists.email,
              name: `${isUserExists.firstName} ${isUserExists.lastName}`,
              image: isUserExists.image,
            },
            "ME3DS8TY2N",
            { expiresIn: "5m" }
          );
          console.log("Logged In..");

          //set your cookie

          res.cookie("userToken", token);
          res.redirect("/dashboard");
        } else {
          console.log("Wrong Password..");
        }
      } else {
        console.log("Email Does not exists");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @Method logout
   * @Description To logout Admin
   */

  async logout(req, res) {
    try {
      console.log(req.cookies);
      res.clearCookie("userToken");
      console.log("Cookie Cleared!");
      res.redirect("/");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @Method Table
   * @Description To render Table Page
   */
  async table(req, res) {
    try {
      res.render("admin/table", {
        title: "Admin || Register",
        user: req.user,
      });
    } catch (err) {
      throw err;
    }
  }

  //< For Data Save......!>

  /**
   * Method:Add Data
   */

  async addData(req, res) {
    try {
      res.render("admin/addData", {
        title: "Admin || DataAdd",
      });
    } catch (err) {
      throw err;
    }
  }
  /**
   * @method: SaveData
   * @description: To Save User data
   */

  async saveData(req, res) {
    try {
      console.log(req.file);
      req.body.image = req.file.filename;

      let isEmailExist = await userDataModel.findOne({ email: req.body.email });
      if (!isEmailExist) {
        if (req.body.password === req.body.confirmPassword) {
          req.body.password = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10)
          );
          let saveData = await userDataModel.create(req.body);
          if (saveData && saveData._id) {
            console.log(saveData);
            console.log("Data Added....");
            res.redirect("/showTable");
          } else {
            console.log("Data not Added....");
            res.redirect("/dashboard");
          }
        } else {
          console.log("Password and confirm password does not match");
        }
      } else {
        console.log("Email already exists");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method:ShowTable
   * @description:To Show User Data Table
   */
  async showTable(req, res) {
    try {
      let userData = await userDataModel.find({});
      res.render("admin/table", {
        title: "Admin|| UserData",
        userData,
        user: req.user,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method:  Delete
   * @description:To Delete User Data
   */

  async delete(req, res) {
    try {
      let deleteData = await userDataModel.findByIdAndRemove(req.params.id);
      if (deleteData) {
        console.log("Data Delete Sucessfully");
        res.redirect("/showTable");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method:dataUpdate
   * @description: To Update user data
   */

  async edit(req, res) {
    try {
      let adminData = await userDataModel.find({ _id: req.params.id });

      res.render("admin/dataUpdate", {
        title: "Admin || UserEdit",
        response: adminData[0],
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Description:to show Update data
   */
  async updateData(req, res) {
    try {
      req.body.image = req.file.filename;
      let isEmailExsist = await userDataModel.find({
        email: req.body.email,
        _id: { $ne: req.body.id },
      });
      if (!isEmailExsist.length) {
        if (req.file) {
          let userUpdate = await userDataModel.findByIdAndUpdate(
            req.body.id,
            req.body
          );
          if (userUpdate && userUpdate._id) {
            console.log("Data Updated..!");
            res.redirect("/showTable");
          } else {
            console.log("Data Not Updated...!");
          }
        }
      } else {
        console.log("Email is Already Exsist");
      }
    } catch (err) {
      throw err;
    }
  }

  //<FAQ Part.....!>

  /**
   * @method:ShowFAQ
   * @description: To Render FAQ Table
   */

  async showFAQ(req, res) {
    try {
      let userQuestion = await faqModel.find({});
      res.render("admin/showFaq", {
        title: "Admin|| Show Question",
        userQuestion,
        user: req.user,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method:Question FAQ
   * @description: To Render FAQ Question Page
   */

  async questionFAQ(req, res) {
    try {
      res.render("admin/question", {
        title: "Admin || ShowFAQ-Table",
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method:Sava-Question
   * @description: To save Question-Answer
   */
  async saveQuestion(req, res) {
    try {
      let saveQuestion = await faqModel.create(req.body);
      if (saveQuestion && saveQuestion._id) {
        console.log("Question Added...!");
        res.redirect("/showFAQ");
      } else {
        console.log("Question not Added...!");
        res.redirect("/showFAQ");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method: Question Delete
   */

  async deleteQuestion(req, res) {
    try {
      let deleteData = await faqModel.findByIdAndRemove(req.params.id);
      if (deleteData) {
        console.log("Question Delete Sucessfully");
        res.redirect("/showFAQ");
      }
    } catch (err) {
      throw err;
    }
  }

  //< Blog Parts.....!>

  /**
   * @method: Show Blog
   * @description: To render Blog Table
   */

  async showBlog(req, res) {
    try {
      let isblogContent = await blogModel.find({});
      res.render("admin/blogTable", {
        title: "Admin|| Show Blog Table",
        isblogContent,
        user: req.user,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method:Blog Add
   * @description: To render Add blog page
   */

  async blogAdd(req, res) {
    try {
      res.render("admin/blogAdd", {
        title: "Admin || Add-Blog",
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method: Save blog
   * @description: To Create blog Content
   */

  async saveBlogContent(req, res) {
    try {
      req.body.image = req.file.filename;
      let saveContent = await blogModel.create(req.body);
      if (saveContent && saveContent._id) {
        console.log(saveContent);
        console.log("Content Created...!");
        res.redirect("/showBlog");
      } else {
        console.log("Content not Created...!");
        res.redirect("/showBlog");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method:Delete Content
   */

  async deleteBlog(req, res) {
    try {
      let deleteData = await blogModel.findByIdAndRemove(req.params.id);
      if (deleteData) {
        console.log("Content Delete Sucessfully");
        res.redirect("/showBlog");
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AdminController();
