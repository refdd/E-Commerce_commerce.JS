import React from 'react'
import { Container, Typography, Button, Grid } from "@material-ui/core"
import CartItem from './Cartitem/Cartitem'

import { Link } from "react-router-dom"
import useStyle from "./style"
const Cart = ({ cartItem, deleteAll, removeItem, handleUpdateCartQty }) => {

    const EmptyCart = () => (
        <Typography variant='subtitle1' >You have no item in your shopping cart ,
            <Link to="/" className={classes.link} >start adding some </Link>!
        </Typography>
    )
    const classes = useStyle()

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cartItem.line_items.map((lineItem) => (
                    <Grid item xs={12} sm={4} key={lineItem.id}>
                        <CartItem item={lineItem} removeItem={removeItem} handleUpdateCartQty={handleUpdateCartQty} />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">Subtotal: {cartItem.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={deleteAll} >Empty cart</Button>
                    <Button className={classes.checkoutButton} component={Link} to="/checkout" size="large" type="button" variant="contained" color="primary">Checkout</Button>
                </div>
            </div>
        </>
    )

    if (!cartItem.line_items) return "loading"

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography variant='h3' className={classes.title} gutterBottom >Your Shopping Cart </Typography>
            {!cartItem.line_items.length ? <EmptyCart /> : <FilledCart />}
        </Container>
    )
}

export default Cart