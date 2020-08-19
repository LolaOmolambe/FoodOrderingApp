var mongoose = require("mongoose");

const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
        orderId: orders._id,
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
  let orderQuery = Order.find({}).sort({createdAt: 'descending'});

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
  let orderQuery = OrderProduct.find({ customer: req.userData.userId }).sort({createdAt: 'descending'});

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

exports.getCheckoutSession = async (req, res, next) => {
  //1. Get the currently booked order
  try {
    const order = await Order.findById(req.params.orderId);

    //2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      //success_url: `http://localhost:4200/thankyou/${order._id}`,
      success_url: `https://vegedepot.netlify.app/thankyou/${order._id}`,
      cancel_url: `https://vegedepot.netlify.app/shoplist`,
      customer_email: req.userData.email,
      client_reference_id: req.params.orderId,
      line_items: [
        {
          name: `VegeDepot Payment`,
          description: "Payment for Veggies",
          amount: order.grandTotal * 100,
          currency: "ngn",
          quantity: 1,
        },
      ],
    });

    console.log("session ", session);
    ////Create checkoutsession
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    // if (Object.keys(req.body).length === 0) {
    //   return res.status(400).json({
    //     message: "Body content cannot be empty!",
    //   });
    // }

    let { status } = req.body;
    console.log("updateBody ", status);

    if (!status || !status.trim()) {
      return res.status(400).json({
        message: "Please enter the status!",
      });
    }

    try {
      let result = await Order.findByIdAndUpdate(req.params.orderId, {
        status: status,
      });
      console.log("result ", result);
      res
        .status(200)
        .json({ status: "success", message: "Update successful!" });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Not authorized!" });
    }
    //await User.findByIdAndUpdate(req.params.id, { isActive: true });

    // (result) => {
    //   console.log("result ", result);
    //   if (result.n > 0) {
    //
    //   }
    //   }
    // }
    //);
    console.log("result");
  } catch (err) {
    res.status(500).json({
      message: "Couldn't update order!",
    });
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    console.log(req.params.orderId);
    let order = await Order.findById(req.params.orderId);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found!" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Fetching Order failed!",
    });
  }
};

