const User = require("./../models/User");

exports.getAllUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const userQuery = User.find().select("+isActive").sort({createdAt: 'descending'});
 
  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  userQuery
    .then((documents) => {
      fetchedUsers = documents;
      return User.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Users fetched successfully!",
        users: fetchedUsers,
        maxUsers: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching users failed!",
      });
    });

};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

//For users
exports.updateMe = async (req, res, next) => {
  ///Check if user wants to update password
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      message: "Not for password update",
    });
  }
 
  //update user document
  const filteredBody = filterObj(req.body, "firstName", "lastName", "address", "phoneNumber");
  
  const updatedUser = await User.findByIdAndUpdate(req.userData.userId, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteUser = async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
};

exports.activateUser = async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: true });

  res.status(204).json({
    status: "success",
    data: null,
  });
};

exports.getUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Fetching user failed!",
    });
  }
};
