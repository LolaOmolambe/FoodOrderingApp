const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

exports.statistics = async (req, res, next) => {
  try {
    let userCount = await User.count();
    var orderCount = await Order.count();
    var productCount = await Product.count();
    var totalSales;

    var totalSum = Order.aggregate(
      [
        {
          $group: {
            _id: null,
            total: {
              $sum: "$grandTotal",
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          totalSales = result;
          res.status(201).json({
            message: "Statistics fetched successfully",
            userCount: userCount,
            orderCount: orderCount,
            productCount: productCount,
            totalSales: totalSales[0].total,
          });
         
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Statistics fetching failed!",
    });
  }
};
