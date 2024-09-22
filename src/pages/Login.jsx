import loginImg from '../assets/Images/login.webp'
import Template from '../components/core/Auth/Template'

function Login(){
    return(
        <Template
            title='Welcome Back'
            description1 = "Build Skills for today, tommorow and beyond."
            description2 = "Education to future-proof your carrer."
            image = {loginImg}
            formType="login"
        />
    )
}

export default Login