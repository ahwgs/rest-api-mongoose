const MsgUtil = {
    successStatus: {
        status: 0
    },
    successMsg: {
        msg: 'success',
        status: 0
    },
    errorStatus: {
        status: 1
    },
    errorMsg: {
        msg: '系统异常,请联系管理员',
        status: 1
    },
    tokenFailure:{
        msg: 'token过期,请重新登陆',
        status: 2
    }
}

module.exports = MsgUtil