// export const Response = ({success = false, message = "System Error", data = null = {}} ) =>{
//     return JSON.stringify({
//         success:success,
//         message:message,
//         data:data
//     })
// }

const Response = ({ success = false, message = "System Error", data = null } = {}) => {
    return {
        success: success,
        message: message,
        data: data
    };
};


module.exports = Response;