import React from 'react'
import { Grid } from "@material-ui/core"
import Product from './protuct/product'
import usestyle from "./style";




const Products = ({ ProductsItem, handelAddToCart }) => {

  const classes = usestyle()
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Grid container justifyContent="center" spacing={4}>
        {ProductsItem.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
            <Product product={product} handelAddToCart={handelAddToCart} />
          </Grid>
        ))}
      </Grid>
    </main>
  )
}

export default Products