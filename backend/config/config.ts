export default ()=>({
    port:process.env.PORT,
    jwt:{
        secret:process.env.JWT_SECRET_KEY
    },
    expireTime:{
        accessToken:process.env.ACCESS_TOKEN_EXPIRE_TIME,
        refreshToken:process.env.REFRESH_TOKEN_EXPIRE_TIME,
        cookie:process.env.COOKIE_EXPIRE_TIME
    }
})