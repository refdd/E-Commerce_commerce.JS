import React, { useState, useEffect } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from "@material-ui/core"
import { useForm, FormProvider } from "react-hook-form"
import CustomTextField from "./CustomTextField"
import { commerce } from "../../lib/commerce"
import { Link } from 'react-router-dom'
const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm()

    const fetchShippingCounttries = async (checkoutToukenId) => { //to get all  countries  
        const { countries } = await commerce.services.localeListShippingCountries(checkoutToukenId)
        // the checkoutToukenId we well get it from the  checkout comp  and use it when we coll the fun
        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0]) // new we have one countrie here 
    }

    const fetchSubdivisions = async (CountryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(CountryCode)
        setShippingSubdivisions(subdivisions)
        setShippingSubdivision(Object.keys(subdivisions)[0])
    }
    const fetchShippingOptions = async (checkoutToukenId, country, region = null) => {
        const option = await commerce.checkout.getShippingOptions(checkoutToukenId, { country, region })
        setShippingOptions(option)
        setShippingOption(option[0].id)

    }

    useEffect(() => {
        fetchShippingCounttries(checkoutToken.id)
    }, []);

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry) // do if becouse maby shippingCountry is empty
    }, [shippingCountry]);

    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision) // do if becouse maby shippingCountry is empty
    }, [shippingSubdivision]);

    //to can loop for all key and value 
    const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }))
    //to con loop for all subdivision 
    const subdivision = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }))
    // to can loop for all option 
    const option = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} _ ${sO.price.formatted_with_symbol}` }))

    return (
        <>
            <Typography variant='h6' gutterBottom > Shopping Addrees  </Typography>
            <FormProvider {...methods}>
                {/* we use the ... not data  only becouse we have to knid of input no the same  */}
                <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
                    <Grid container spacing={3} >
                        <CustomTextField required name="firstName " label="Frist Name " />
                        <CustomTextField required name="lastName " label="Last Name " />
                        <CustomTextField required name="address" label="Address" />
                        <CustomTextField required name="email " label="Email" />
                        <CustomTextField required name="city " label="City " />
                        <CustomTextField required name="zip" label="ZIP / Postal Code" />
                        <Grid item xs={12} sm={6}  >
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)} >
                                {countries.map((item) => (
                                    <MenuItem key={item.id} value={item.id} >
                                        {item.label}
                                    </MenuItem>
                                ))}


                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}  >
                            <InputLabel>Shipping Subdinision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)} >
                                {subdivision.map((item) => (
                                    <MenuItem key={item.id} value={item.id} >
                                        {item.label}
                                    </MenuItem>

                                ))}

                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}  >
                            <InputLabel>Shipping options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)} >
                                {option.map((option) => (
                                    <MenuItem key={option.id} value={option.id} >
                                        {option.label}
                                    </MenuItem>

                                ))}
                            </Select>
                        </Grid>

                    </Grid>
                    <br />
                    <div style={{ display: "flex", justifyContent: "space-between" }} >
                        <Button component={Link} to="/cart" variant='outlined' > Back To Cart </Button>
                        <Button type='submit' variant='contained' color='primary' > Next </Button>
                    </div>

                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
