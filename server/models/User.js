import mongoose from 'mongoose';
import pkg from 'bcryptjs';
const { genSalt, hash } = pkg;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

export default User;
