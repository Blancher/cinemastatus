const fs = require('fs');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async(req, res, next) => {
    const errors = validationResult(req);
    const image = req.file.path;
    const {username, email, password} = req.body;
    
    if (!errors.isEmpty()) {
        fs.unlink(image, err => console.log(err));
        return res.status(422).json({message: errors.array().map(error => error.msg)});
    }

    try {
        const existingEmail = await User.findOne({email});
        const existingName = await User.findOne({username});

        if (existingEmail || existingName) {
            fs.unlink(image, err => console.log(err));
            return res.status(401).json({message: 'User already exists.'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({username, image, email, password: hashedPassword});
        await user.save();
        const token = jwt.sign({userId: user.id}, process.env.JWT_KEY);
        return res.status(201).json({token, userId: user.id, image: user.image});
    } catch(err) {
        fs.unlink(image, err => console.log(err));
        return res.status(500).json({message: 'Signup failed'});
    }
};

exports.login = async(req, res, next) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        const isValid = await bcrypt.compare(password, user.password);

        if (!user || !isValid) {
            return res.status(401).json({message: 'Invalid email or password.'});
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_KEY);
        return res.status(200).json({token, userId: user.id, image: user.image});
    } catch(err) {
        return res.status(500).json({message: 'Signup failed'});
    }
};