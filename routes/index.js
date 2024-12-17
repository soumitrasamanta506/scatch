const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { logout } = require("../controllers/authController")
const router = express.Router();

const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

router.get("/", function(req, res){
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function(req, res){
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
})

router.get("/cart", isLoggedIn, async function(req, res){
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");
    const bill = user.cart.price+20-user.cart.discount;
    res.render("cart", { user, bill });
})

router.get("/addtocart/:productId", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({ email: req.user.email });

    user.cart = req.params.productId;
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});

router.get("/logout", isLoggedIn, logout);

module.exports = router