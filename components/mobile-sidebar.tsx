import React from 'react'
import { Button } from './ui/button'
import { Menu, Sidebar } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const MobileSidebar = () => {
    return (
        <div>
            <Sheet>
                <SheetTrigger>
                    <Button variant={"ghost"} size={"icon"} className='md:hidden'>
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side={"left"} className='p-0'>
                    <Sidebar/>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileSidebar
