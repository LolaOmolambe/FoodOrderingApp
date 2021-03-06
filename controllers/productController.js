const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Product content cannot be empty!",
    });
  }

  let { title, price, genre, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Please enter product name!",
    });
  }
  title = title.trim().toUpperCase();

  if (!price) {
    return res.status(400).json({
      message: "Please enter product price!",
    });
  }
  price = parseFloat(price);

  if (!genre || !genre.trim()) {
    return res.status(400).json({
      message: "Please enter product genre!",
    });
  }
  genre = genre.trim();

  if (description) {
    description = description.trim();
  }

  try {
    let createdProduct = await new Product({
      name: title,
      price: price,
      genre: genre,
      description: description,
      imagePath: req.file.url,
    }).save();

    res.status(201).json({
      message: "Product added successfully",
      post: {
        ...createdProduct,
        id: createdProduct._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Creating a product failed!",
    });
  }
};

exports.getProducts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  let productQuery = Product.find().sort({ createdAt: "descending" });

  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery
    .then((documents) => {
      fetchedProducts = documents;
      return Product.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Products fetched successfully!",
        products: fetchedProducts,
        maxProducts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching products failed!",
      });
    });
};

exports.getProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found!" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Fetching product failed!",
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product item not found!" });
    }
    
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Body content cannot be empty!",
      });
    }

    let { price, genre } = req.body;
    let { title, imagePath, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Please enter the name of the product!",
      });
    }
    if (!price) {
      return res.status(400).json({
        message: "Please enter product price!",
      });
    }
    price = parseFloat(price);

    if (!genre || !genre.trim()) {
      return res.status(400).json({
        message: "Please enter product genre!",
      });
    }
    genre = genre.trim();

    if (description) {
      description = description.trim();
    }

    if (req.file) {
      imagePath = req.file.url;
    }

    let createdProduct = new Product({
      _id: req.body.id,
      name: title,
      price: price,
      genre: genre,
      description: description,
      imagePath: imagePath,
      //isAvailable: isAvailable,
      isAvailable: true,
    });
    Product.updateOne({ _id: req.params.id }, createdProduct).then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Couldn't update product!",
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    let result = await Product.deleteOne({ _id: req.params.id });
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Deleting posts failed!",
    });
  }
};

exports.getProductsByCategory = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const { genre } = req.body;
  let productQuery;

  if (genre == "all") {
    productQuery = Product.find().sort({
      createdAt: "descending",
    });
  } else {
    productQuery = Product.find({ genre: genre }).sort({
      createdAt: "descending",
    });
  }

  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery
    .then((documents) => {
      fetchedProducts = documents;
      return Product.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Products fetched successfully!",
        products: fetchedProducts,
        maxProducts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching products failed!",
      });
    });
};
