const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
};

module.exports = { getProfile };
