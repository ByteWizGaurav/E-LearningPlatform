import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { ApiError } from '../utils/ApiError.util.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.util.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';

const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;

    const responseData = {
      user,
    };

    res.status(200).json(new ApiResponse(200, responseData));
});

const getUserProfileByDetails = asyncHandler(async (req, res) => {
    const {username} = req.params;

    const user = await User.find({username}).select("-password -refreshToken");

    const responseData = {
      user,
    };

    res.status(200).json(new ApiResponse(200, responseData));
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const {username, name, email} = req.body;

    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    const responseData = {
      user,
      message: 'Profile updated successfully',
    };

    res.status(200).json(new ApiResponse(200, responseData));
});

const changeUserPassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const {password, newPassword} = req.body;

    // Check if the provided current password is correct
    const isCurrentPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isCurrentPasswordCorrect) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    // Update the password
    user.password = newPassword;

    // Save the updated user data
    await user.save();

    const responseData = {
      message: 'Password changed successfully',
    };

    res.status(200).json(new ApiResponse(200, responseData));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Delete the user from the database
    await user.remove();

    const responseData = {
        message: 'Account deleted successfully',
    };

    res.status(200).json(new ApiResponse(200, responseData));
});

export { getUserProfile, updateUserProfile, changeUserPassword, deleteUserAccount };