import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'
import useStyle from "./style"
import { commerce } from "../../../lib/commerce"
import AddressForm from "../AddressForm"
import PaymentForm from "../PaymentForm"
import { PersonalVideo } from '@material-ui/icons'
import { Link } from 'react-router-dom'

const steps = ["Shipping Address", "Payment Details"]




const CheckOut = ({ cartItem, onCaptureCheckout, order, error, refreshCart }) => {
    const classes = useStyle()
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [isFinish, setIsFinish] = useState(false);

    const [shippingData, setShippingData] = useState({}) //here save all shipping data 

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1) // to gp the next step 
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1) // to gp the back  step 



    useEffect(() => {
        const grnerateToken = async () => { // if we get toakenid sent it if not error
            try {
                const token = await commerce.checkout.generateToken(cartItem.id, { type: "cart" })
                setCheckoutToken(token)
            } catch (error) {
            }
        }

        grnerateToken()
    }, [cartItem])


    console.log(checkoutToken)


    const next = (data) => {
        setShippingData(data) //WE well send all data hear  and =>
        nextStep() // go to next step 
    }

    const timeOut = () => {
        setTimeout(() => {
            setIsFinish(true)
        }, 3000);
    }

    let Confirmation = () => (order.customer ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
    ) : isFinish ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase,</Typography>
                <Divider className={classes.divider} />

            </div>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    ));



    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm
            shippingData={shippingData}
            checkoutToken={checkoutToken}
            backStep={backStep}
            onCaptureCheckout={onCaptureCheckout}
            order={order}
            error={error}
            nextStep={nextStep}
            refreshCart={refreshCart}
            timeOut={timeOut}
        />

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout} >
                <Paper className={classes.paper} >
                    <Typography variant='h4' align='center'  > CheckOut </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}  >

                        {steps.map(step => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>

            </main>
        </>
    )
}

export default CheckOut