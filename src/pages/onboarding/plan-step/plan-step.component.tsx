/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {usePricingPage} from '~/graphqls/contentful/usePricingPage';
import {useState} from 'react';
import {useSubscribeToPlan} from '~/graphqls/useSubscribeToPlan';
import {Toast} from '~/components/toast/toast.component';
import {Box, Grid, Link, Typography} from '@mui/material';
import {OpenInNewRounded} from '@mui/icons-material';
import {ProductCard} from "../components/pricing/product-card.component";
import Image from 'next/image';

interface Props {
    show: boolean;
    onNext: () => void;
}

export function PlanStep(props: Props) {

    const {show, onNext} = props;
    const pricingPage = usePricingPage();
    const subscribeToPlan = useSubscribeToPlan();
    const [openFailToast, setOpenFailToast] = useState(false);
    const [disabled, setDisabled] = useState(false);

    async function handleClick() {

        try {

            setDisabled(true);
            await subscribeToPlan('FreePlan');
            onNext();

        } catch (err: any) {

            setOpenFailToast(true);
            setDisabled(false);
        }
    }

    if (!show || !pricingPage) return null;

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Grid
                container
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                mt={1}
            >
                <Grid item>
                    <Typography
                        align="center"
                        variant="h4"
                    >
                        {pricingPage?.headline}
                    </Typography>
                    <Typography
                        align="center"
                        variant="h6"
                        mt={1}
                    >
                        {pricingPage?.description}
                    </Typography>
                </Grid>
                <Grid
                    container
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="start"
                    mt={2}
                >
                    {pricingPage?.products?.map(product =>
                        <Grid
                            item
                            key={product.code}
                            lg={4}
                            px={6}
                        >
                            <ProductCard product={product} disabled={disabled} onClick={handleClick}/>
                        </Grid>
                    )}
                </Grid>
                {/*<Grid item mt={1}>
                    <ProductList products={pricingPage?.products}/>
                </Grid>*/}
                <Grid item mt={1}>
                    <Link
                        href={`${process.env.NEXT_PUBLIC_WEB_SITE_DOMAIN}/pricing`}
                        target="_blank"
                        sx={{
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Box>See Pricing FAQ for more details</Box>
                        <OpenInNewRounded
                            sx={{
                                width: "17px",
                                height: "17px",
                                marginLeft: "8px",
                            }}
                        />
                    </Link>
                </Grid>
                <Grid item mt={1}>
                    <Image src="/images/stripe.png" alt="Powered by Stripe" width="177" height="40"/>
                </Grid>
            </Grid>
            <Toast
                open={openFailToast}
                severity='error'
                description="Subscribe to plan failed"
                onClose={() => setOpenFailToast(false)}/>
        </Box>
    );
}