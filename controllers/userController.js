import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("This email address is already registered.");
    }

    if (req.file) {
      req.body.avatar = req.file.path;
    }

    const userData = {
      ...req.body,
      createdBy: req.user ? req.user.id : null,
    };

    if (!password) {
      userData.password = "User@" + Math.random().toString(36).slice(-5);
    }

    const user = await User.create(userData);
    res.status(201).json({
      success: true,
      message: "New member has been onboarded successfully",
      data: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("We couldn't find an account with that email.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("The password you entered is incorrect.");
    }
    res.json({
      success: true,
      message: `Welcome back, ${user.first_name} ${user.last_name}! You have successfully logged in.`,
      data: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const calculateTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  const diff = ((current - previous) / previous) * 100;
  return parseFloat(diff.toFixed(1));
};

export const getUserStats = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers,
      usersBeforeThisMonth,
      newUsersThisMonth,
      newUserLastMonth,
      activeUsers,
      pendingUsers,
      inactiveUsers,
    ] = await Promise.all([
      User.countDocuments({ createdBy: ownerId }),
      User.countDocuments({
        createdBy: ownerId,
        created_at: { $lt: thisMonthStart },
      }),
      User.countDocuments({
        createdBy: ownerId,
        created_at: { $gte: thisMonthStart },
      }),
      User.countDocuments({
        createdBy: ownerId,
        created_at: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
      User.countDocuments({ createdBy: ownerId, status: "Active" }),
      User.countDocuments({ createdBy: ownerId, status: "Pending" }),
      User.countDocuments({ createdBy: ownerId, status: "Inactive" }),
    ]);

    const totalTrend = calculateTrend(totalUsers, usersBeforeThisMonth);
    const newUserTrend = calculateTrend(newUsersThisMonth, newUserLastMonth);

    res.json({
      success: true,
      data: {
        total: {
          value: totalUsers,
          trendValue: Math.abs(totalTrend),
          trend: totalTrend >= 0 ? "up" : "down",
        },
        newUsers: {
          value: newUsersThisMonth,
          trendValue: Math.abs(newUserTrend),
          trend: newUserTrend >= 0 ? "up" : "down",
        },
        active: {
          value: activeUsers,
          trendValue:
            totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0,
          trend: "up",
        },
        pending: {
          value: pendingUsers,
          trendValue: 0,
          trend: "down",
        },
        inactive: {
          value: inactiveUsers,
          trendValue: 0,
          trend: "down",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ createdBy: req.user.id }).sort({
      created_at: -1,
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (emailExists) {
        res.status(400);
        throw new Error(
          "This email is already associated with another member.",
        );
      }
    }

    if (req.body.password) {
      delete req.body.password;
    }

    if (req.file) {
      req.body.avatar = req.file.path;
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!user) {
      res.status(404);
      throw new Error(
        "Update failed: You don't have permission to modify this account.",
      );
    }
    res.json({
      success: true,
      message: "The member's profile has been successfully updated.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      res.status(400);
      throw new Error(
        "Security Policy: You cannot delete your own administrator account",
      );
    }

    const user = await User.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!user) {
      res.status(404);
      throw new Error(
        "Action denied: We couldn't find the member or you lack permission.",
      );
    }
    res.json({
      success: true,
      message: "The member has been safely removed from your organization.",
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
