// login & register

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const User = require('../../models/User');
const MsgUtil = require('../../utils/msgUtil');
const TokenUtil = require('../../utils/tokenUtil');

/**
 * @router api/user/test
 * @method GET
 * access public
 */
router.get('/test', (req, res) => {
    res.json(MsgUtil.successMsg)
})

/**
 * @router api/user/login
 * @method POST
 * @param email
 * @param password
 * @access public
 */
router.post('/login', (req, res) => {
    const {email, password} = req.body
    try {
        User.findOne({email})
            .then((user) => {
                //用户不存在
                if (!user) {
                    return res.json({msg: '用户不存在', ...MsgUtil.errorStatus})
                }
                //解密
                bcrypt.compare(password, user.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            //token 的规则
                            const rule = {
                                id: user.id,
                                name: user.name
                            }
                            const token = TokenUtil.generateToken(rule);

                            res.json({
                                ...MsgUtil.successMsg,
                                data: {
                                    token: token,
                                    id: user.id,
                                    email: user.email,
                                    name: user.name,
                                    avatar: user.avatar
                                }
                            })

                            //生成token


                        } else {
                            return res.json({msg: '密码错误', ...MsgUtil.errorStatus})
                        }
                    }).catch((err) => {
                    console.log(err);
                    return res.json(MsgUtil.errorMsg)
                })
            })


    } catch (e) {
        console.log(e);
        return res.json(MsgUtil.errorMsg)
    }
})


/**
 * @router api/user/register
 * @method POST
 * @param email
 * @param password
 * @param name
 * @access public
 */
router.post('/register', (req, res) => {
    console.log(req.body);
    const {email, password, name} = req.body

    //查询数据库中是否已经有该邮箱
    User.findOne({email})
        .then((user) => {
            if (user) {
                return res.json({msg: '该用户已存在', ...MsgUtil.errorStatus})
            } else {
                const avatar = gravatar.url(email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    email,
                    password,
                    name,
                    avatar
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err

                        newUser.password = hash;
                        newUser.save()
                            .then((user) => {
                                if (user)
                                    res.json({...MsgUtil.successMsg})
                            })
                            .catch((err) => {
                                res.json(MsgUtil.errorMsg)
                            })
                    });
                });
            }
        })
        .catch((err) => {
            res.json(MsgUtil.errorMsg)
        })
})

/**
 * @router api/user/verifyToken
 */
router.get('/verifyToken', (req, res) => {
    console.log(TokenUtil.getUserIdByToken(req.query.token));
    res.json({
        ...MsgUtil.successMsg
    })
})


module.exports = router