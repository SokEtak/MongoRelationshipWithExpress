const mongoose = require("mongoose")
const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ["drinks", "food","snack"],//value that allow to insert only
    lowercase: true,
  },
  farm:{
    type:Schema.Types.ObjectId,
    ref:'Farm'// Farm is the Model
  }
});



//creating model
const Product = mongoose.model("Product", productSchema);

//export model
module.exports = Product;
