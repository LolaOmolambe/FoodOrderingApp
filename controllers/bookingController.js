const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = async (req, res, next) => {
  //1. Get the currently booked order
  try {
    const order = await Order.findById(req.params.orderId);

    //2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://${req.get("host")}/`,
      cancel_url: `${req.protocol}://${req.get("host")}/shoplist`,
      customer_email: req.userData.email,
      client_reference_id: req.params.orderId,
      line_items: [
        {
          name: `${order.grandTotal} kkk`,
          description: "Vegiees",
          amount: order.grandTotal * 100,
          currency: "ngn",
          quantity: 1,
        },
      ],
    });

    //
    res.status(200).json({
        status: 'success',
        session
    })
  } catch (err) {
    console.log(err);
  }

  //Create checkoutsession
};
