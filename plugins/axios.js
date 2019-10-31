// 用于请求axios的拦截插件
import { Message } from 'element-ui';

export default ({ $axios, redirect }) => {
    // 请求头

    // 错误拦截 ，onError用于错误拦截
    $axios.onError(res => {
        // 返回的res是一个错误对象，Error对象下都有一个response的属性可以访问错误的信息

        // 解构出错误信息  和编码
        const { message, statusCode } = res.response.data;

        if (statusCode === 400) {
            // console.log(1)
            Message.error(message)
        }

        if (statusCode === 401 || statusCode === 403) {
            // console.log(1)
            Message.error('请登录')
            redirect('/user/login')
        }

    })
}
