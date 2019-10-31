// 用户管理
export const state = {
    // 采用接口返回的数据结构

    userInfo: {
        token: "",
        user: {}

    }
}

export const mutations = {
    setuserInfo(state, data) {
        state.userInfo = data
    },

    delUserInfo(state, data) {
        state.userInfo = {
            token: "",
            user: {}
        }
    }
}