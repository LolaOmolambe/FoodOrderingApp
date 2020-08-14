const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");

exports.createOrder = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Order content cannot be empty!",
    });
  }

  var ordersBody = req.body.orders;
  //console.log("oredrdbpdy ", ordersBody);

  const orders = await new Order({
    customer: req.userData.userId
  }).save();

 
  let ordersArray = [];

  for(let item of ordersBody){
      console.log(item);
    let x = {order_id: orders._id,
        product_id: item.productId,
        product_quantity: item.qty,
        product_price: item.total

    }
    ordersArray.push(x);
  }
  console.log(ordersArray);

//   var books = [{ name: 'Mongoose Tutorial', price: 10, quantity: 25 },
//                     { name: 'NodeJS tutorial', price: 15, quantity: 5 },
//                     { name: 'MongoDB Tutorial', price: 20, quantity: 2 }];
 
    // save multiple documents to the collection referenced by Book Model
    OrderProduct.collection.insert(ordersArray, function (err, docs) {
      if (err){ 
          return console.error(err);
      } else {
        console.log("Multiple documents inserted to Collection");
      }
    });




  //const { title } = req.body;
  // let { title, price, genre, description } = req.body;

  // if (!title || !title.trim()) {
  //   return res.status(400).json({
  //     message: "Please enter product name!",
  //   });
  // }
  // title = title.trim().toUpperCase();

  // if (!price) {
  //   return res.status(400).json({
  //     message: "Please enter product price!",
  //   });
  // }
  // price = parseFloat(price);

  // if (!genre || !genre.trim()) {
  //   return res.status(400).json({
  //     message: "Please enter product genre!",
  //   });
  // }
  // genre = genre.trim();

  // if (description) {
  //   description = description.trim();
  // }

  // try {
  //   const url = req.protocol + "://" + req.get("host");
  //   let createdProduct = await new Product({
  //     name: title,
  //     price: price,
  //     genre: genre,
  //     description: description,
  //     imagePath: url + "/images/" + req.file.filename,
  //   }).save();

  //   res.status(201).json({
  //     message: "Product added successfully",
  //     post: {
  //       ...createdProduct,
  //       id: createdProduct._id,
  //     },
  //   });
  // } catch (err) {
  //   res.status(500).json({
  //     message: "Creating a product failed!",
  //   });
  // }
};

// exports.getAllOrders = (req, res, next) => {
//   const pageSize = +req.query.pagesize;
//   const currentPage = +req.query.page;

//   let ordersQuery = OrderProduct.find();

//   if (pageSize && currentPage) {
//     ordersQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
//   }
//   ordersQuery
//     .then((documents) => {
//       fetchedProducts = documents;
//       return Product.count();
//     })
//     .then((count) => {
//       res.status(200).json({
//         message: "Products fetched successfully!",
//         products: fetchedProducts,
//         maxProducts: count,
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Fetching products failed!",
//       });
//     });
// };
