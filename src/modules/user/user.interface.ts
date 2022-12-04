interface User {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    isEmailConfirmed: boolean;
    isPhoneConfirmed: boolean;
    isVerified: boolean;
    password: string;
    address?: {
        street: string;
        city: string;
    };
}

export default User;
