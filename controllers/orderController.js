var mongoose = require("mongoose");

const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");
const User = require("../models/User");

exports.createOrder = async (req, res, next) => {
  console.log("orders roit");
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Order content cannot be empty!",
    });
  }

  var ordersBody = req.body.orders;
  var grandTotal = req.body.total;
  //console.log("oredrdbpdy ", ordersBody);

  let ordersArray = [];
  //let grandTotal = 0;

  const orders = await new Order({
    customer: req.userData.userId,
    grandTotal,
  }).save();

  for (let item of ordersBody) {
    console.log(item);
    let x = {
      order_id: orders._id,
      product_id: mongoose.Types.ObjectId(item.productId),
      customer: mongoose.Types.ObjectId(req.userData.userId),
      product_quantity: item.qty,
      product_price: item.total,
      
    };
    ordersArray.push(x);
  }

  console.log(grandTotal);

  //   var books = [{ name: 'Mongoose Tutorial', price: 10, quantity: 25 },
  //                     { name: 'NodeJS tutorial', price: 15, quantity: 5 },
  //                     { name: 'MongoDB Tutorial', price: 20, quantity: 2 }];

  // save multiple documents to the collection referenced by Book Model
  OrderProduct.collection.insert(ordersArray, function (err, docs) {
    if (err) {
      //return console.error(err);
      return res.status(500).json({
        message: "Order nor saved!",
      });
    } else {
      console.log("Multiple documents inserted to Collection");
      return res.status(201).json({
        status: "success",
        message: "Order added successfully",
        //   post: {
        //     ...createdProduct,
        //    id: createdProduct._id,
        //  },
      });
    }
  });
};

exports.getAllOrders = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  console.log("here");
  // var resources = {
  //   firstName: "$firstName",
  //   email: "$email",
  // };
  let orderQuery = Order.find({});

  var countOrders = await Order.count();
  if (pageSize && currentPage) {
    orderQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  orderQuery.populate("customer").exec(function (error, result) {
    //console.log(result);

    console.log("orders ", countOrders);
    //return res.json(result);
    return res.status(200).json({
      message: "Orders fetched successfully!",
      orders: result,
      maxOrders: countOrders,
    });
  });

  // User.collection.aggregate([
  //   {
  //     $group: resources,
  //   },
  //   {
  //     $lookup: {
  //       from: "Order",
  //       localField: "_id",
  //       foreignField: "customer",
  //       as: "orders",
  //     },
  //   },
  // ], function (error, data) {
  //   console.log("error ", error);
  //   console.log("data ", data);
  //   return res.json(data);
  // });
};

exports.getMyOrders = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  console.log("here");

  //let orderQuery = Order.find({ customer: req.userData.userId});
  let orderQuery =  OrderProduct.find({ customer: req.userData.userId });
  
  var countOrders = await OrderProduct.count({ customer: req.userData.userId });
  console.log(countOrders);

  if (pageSize && currentPage) {
    orderQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  //foreach orderquery, get the order items
  //foreach

  orderQuery
    .populate("product_id")
    .populate("order_id")
    .exec(function (error, result) {
      //console.log(result);

      console.log("orders ", result);
      //return res.json(result);
      return res.status(200).json({
        message: "Orders fetched successfully!",
        orders: result,
        maxOrders: countOrders,
      });
    });
};
