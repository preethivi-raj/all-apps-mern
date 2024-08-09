import { mailtrapClient , sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_REQUEST_TEMPLATE ,WELCOME_MAIL_TEMPLETE ,PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplates.js";

export const sendVerficationEmail = async(email , verficationToken)=>{
    const recipient = [{ email }];
    const message = {
        from: sender,
        to: recipient,
        subject: "Verify Your Email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verficationToken),
        category : "Email Verfivation"
    };
    try {
       const response = await mailtrapClient.send(message);
       console.log("Email sent Successfully",response)
    } catch (error) {
        console.error("Error in sending verfication  : ",error)
        throw new Error(`Error in sending verfication email : ${error.message}`)
    }
}

export const sendWelcomeEmail = async(email , name)=>{
    const recipient = [{ email }];
    const message = {
        from: sender,
        to: recipient,
        subject: "Welcome to our Service",
        html: WELCOME_MAIL_TEMPLETE.replace("{name}", name),
        category : "Welcome Email"
    }
    try {
       const response = await mailtrapClient.send(message);
       console.log("Email sent Successfully",response)
    } catch (error) {
        console.error("Error in sending welcome email : ",error)
        throw new Error(`Error in sending welcome email : ${error.message}`)
    }
}


export const sendForgotPasswordEmail = async(email , resetURL)=>{
    const recipient = [{ email }];
    const message = {
        from: sender,
        to: recipient,
        subject: "Reset Your Password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        category : "Reset Password"
    };
    try {
       const response = await mailtrapClient.send(message);
       console.log("Email sent Successfully",response)
    } catch (error) {
        console.error("Error in sending reset password email : ",error)
        throw new Error(`Error in sending reset password email : ${error.message}`)
    }
}

export const sendResetPasswordEmail= async (email)=>{
    const recipient = [{ email }];
    const message = {
        from: sender,
        to: recipient,
        subject: "Password Reset Successfully",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        category : "Password Reset"
    };
    try {
       const response = await mailtrapClient.send(message);
       console.log("Email sent Successfully",response)
    } catch (error) {
        console.error("Error in sending reset password email : ",error)
        throw new Error(`Error in sending reset password email : ${error.message}`)
    }
}