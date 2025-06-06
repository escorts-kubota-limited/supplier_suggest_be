import axios from 'axios';

export const sendOtp = async (url, phone_number, otp) => {
    try {
        const response = await axios.get(url);

        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, error: error.message };
    }
};
