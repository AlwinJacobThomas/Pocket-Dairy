const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helper');
/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  let month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  console.log(req.body)
  userHelpers.getAllDetails().then((data)=>{
    
    if (user) {
      res.render('users/user-index', { user, month, data });
    }
    else {
      res.render('users/index', { user });
    }
  })
 
});
router.post('/sort-date',(req,res)=>{
  let date=req.body
  console.log(date)
  res.redirect('/')
})
router.get('/login', (req, res) => {
  if (req.session.loginStatus) {
    res.redirect("/")
  } else {
    res.render('users/login', { "loginErr": req.session.loginErr });
    req.session.loginErr = false
  }
});
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loginStatus = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid Email or Password"
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/signup', function (req, res, next) {
  res.render('users/signup');
});

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    res.redirect('/login')
  })
})
router.get('/add-journal', (req, res) => {
  res.render('users/add-journal')
})
router.post('/add-journal',(req,res)=>{
  let details=req.body
  userHelpers.addDetails(details,()=>{
    console.log(details)
  })
  res.redirect('/login')
})

module.exports = router;
