import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const LandingPage = () => {
    return (
        <div>
            Landing Page (Unprotected)
            <Link href={"/dashboard"}>dash</Link>

            <br />
            <Link href={"/sign-in"}><Button>Sign-In</Button></Link>
            <Link href={"/sign-up"}><Button>Sign-Up</Button></Link>
        </div>
    )
}

export default LandingPage
