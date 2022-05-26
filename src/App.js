import React, { useState, useEffect } from "react";
import { commerce } from "./lib/commerce"; //import the commerce 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { Navbar, Products, Cart, CheckOut } from "./compontents"

function App() {
  const [ProductsItem, setProductsItem] = useState([]) //put  the products there
  const [cart, setCart] = useState({})  //what in the cart
  const [order, setOrder] = useState({})
  const [errorMessage, setErrorMessage] = useState("")


  const fetchProducts = async () => { // use async to fatch products 
    const { data } = await commerce.products.list()
    setProductsItem(data)
    console.log(data)
  }
  const fetchCart = async () => { // use async to fatch products in cart  
    setCart(await commerce.cart.retrieve())
  }
  const handelAddToCart = async (productId, quanitity) => { // use async to push  products in cart  

    //this fun take tow prames productId whice prodcut ti clilk it and how meny produsts

    const items = await commerce.cart.add(productId, quanitity) //hear we add product to the cart then retrieve

    setCart(items.cart)  //hear we updata the cart after the item has been added 


  }

  // fun to increace  quanity 
  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const response = await commerce.cart.update(lineItemId, { quantity });

    setCart(response.cart);
  };
  //fun to to remove from cart 
  const removrFromCart = async (productId) => {
    const removeItem = await commerce.cart.remove(productId)
    setCart(removeItem.cart)
  }
  //fun to epmty cart delete all item 
  const emptyCart = async () => {
    const epmty = commerce.cart.empty()
    setCart((await epmty).cart)
  }
  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

      setOrder(incomingOrder);

    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts() //coll the fun one time 
    fetchCart()
  }, [])



  return (
    <Router>

      <div >
        <Navbar totalItems={cart.total_items} />

      </div>
      <Routes>
        <Route path="/" element={<Products ProductsItem={ProductsItem} handelAddToCart={handelAddToCart} />} />
        <Route path="/cart" element={<Cart cartItem={cart} deleteAll={emptyCart} removeItem={removrFromCart} handleUpdateCartQty={handleUpdateCartQty} />} />
        <Route path="/checkout" element={<CheckOut cartItem={cart} onCaptureCheckout={handleCaptureCheckout} order={order} error={errorMessage} refreshCart={refreshCart} />} />

        {/* <Route path="/" element={<Products ProductsItem={ProductsItem} handelAddToCart={handelAddToCart} />} />  */}

        {/* <Route path="/cart" element={<Cart cartItem={cart} deleteAll={emptyCart} removeItem={removrFromCart} handleUpdateCartQty={handleUpdateCartQty} />} /> */}
        {/* <Route path="/checkout" element={<CheckOut cartItem={cart} onCaptureCheckout={handleCaptureCheckout} order={order} error={errorMessage} refreshCart={refreshCart} />} />  */}
      </Routes>
    </Router>
  );
}

export default App;

