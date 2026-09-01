const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      gender: req.user.gender,
      email: req.user.email
    }
  });
};

module.exports = { getProfile };
