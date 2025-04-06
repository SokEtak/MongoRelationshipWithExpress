const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
var methodOverride = require("method-override")

// MongoDB connection setup
mongoose.connect("mongodb://127.0.0.1:27017/farmStandTake2", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err))

const Product = require("./models/product")
const Farm = require("./models/farm")

// Set up views and view engine
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

const categories = ["drinks", "food", "snack"]

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// Home route
app.get("/", (req, res) => {
  res.send("Home")
})

// Farm Routes
app.get('/farms', async (req, res) => {
  const farms = await Farm.find({})
  res.render('farms/index', { farms })
})

app.get('/farms/new', (req, res) => {
  res.render('farms/new')
})

app.post('/farms', async (req, res) => {
  const farm = new Farm(req.body)
  await farm.save()
  res.redirect('/farms')
})

app.get('/farms/:id', async (req, res) => {
  const { id } = req.params
  const farm = await Farm.findById(id).populate('products')
  res.render('farms/show', { farm })
})

app.delete('/farms/:id', async(req,res)=>{
  const { id } = req.params
    // console.log("Deleting")
    const deltedFarm = await Farm.findByIdAndDelete(id)
    console.log(deltedFarm)
    res.redirect('/farms')
})

app.get('/farms/:id/products/new', async (req, res) => {
  const { id } = req.params
  const farm = await Farm.findById(id)
  res.render('products/new', { categories, farm })
})

app.post('/farms/:id/products', async (req, res) => {
  const { id } = req.params
  const { name, price, category } = req.body
  const farm = await Farm.findById(id)
  const product = new Product({ name, price, category })
  product.farm = farm
  farm.products.push(product)
  await farm.save()
  await product.save()
  res.redirect(`/farms/${id}`)
})

// Product Routes
app.get("/products", async (req, res) => {
  const { category } = req.query
  const products = category ? await Product.find({ category }) : await Product.find({})
  res.render("products/index", { products, category: category || 'All' })
})

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories, farm: {} })
})

app.post("/products", async (req, res) => {
  const product = new Product(req.body)
  await product.save()
  res.redirect("/products")
})

app.get("/products/:id", async (req, res) => {
  const { id } = req.params
  const foundProduct = await Product.findById(id).populate('farm', 'name') 
  res.render("products/show", { product: foundProduct })
})

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params
  const foundProduct = await Product.findById(id)
  res.render("products/edit", { product: foundProduct, categories })
})

app.put("/products/:id", async (req, res) => {
  const { id } = req.params
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  res.redirect(`/products/${product._id}`)
})

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params
  await Product.findByIdAndDelete(id)
  res.redirect("/products")
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`)
})
