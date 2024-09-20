/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        instrumentationHook:true,
    },
    env:{
        NEXT_PUBLIC_DOMAIN:"http://localhost:3000",
        NEXT_PUBLIC_STRIPE_PUBLIC_KEY:"pk_test_51Q0jVLRuuRn1FQJrrSjU6z8KAFZnanSHfXctjhTFw2r0RUoKulCmTaN9r00AYo2LCJiw52MEv0qOvX2fA2IlOkuW00qKef91k3",
    },
    images:{
        remotePatterns:[
            {hostname:"imgcld.yatra.com"},
        ]
    }
};

export default nextConfig;
