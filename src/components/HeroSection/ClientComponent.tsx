'use client';

// import Image from 'next/image';

import React, { FC } from 'react';
import CountUpNumber from '../CountUpNumber/CountUpNumber';
// import { section2 } from './ServerComponent';

type Props = {
    heading1: React.ReactNode;
    section2: React.ReactNode;
}

const ClientComponent: FC<Props> = (props) => {
    const {heading1, section2} = props;
    return (
        <section className="flex px-4 items-center gap-12 container mx-auto">
            <div className="py-10 h-full">
                {heading1}
                
                <div className="flex justify-between mt-12">
                    {/* <div className="flex gap-3 flex-col items-center justify-center">
                        <p className="text-xs lg:text-xl text-center">Deluxe Room</p>
                        <CountUpNumber duration={1000} endValue={5}/>
                    </div>
                    <div className="flex gap-3 flex-col items-center justify-center">
                        <p className="text-xs lg:text-xl text-center">Premium Room</p>
                        <CountUpNumber duration={1000} endValue={5}/>
                    </div>
                    <div className="flex gap-3 flex-col items-center justify-center">
                        <p className="text-xs lg:text-xl text-center">Grand Suite</p>
                        <CountUpNumber duration={1000} endValue={5}/>

                    </div>
                    <div className="flex gap-3 flex-col items-center justify-center">
                        <p className="text-xs lg:text-xl text-center">Presidential Room</p>
                        <CountUpNumber duration={1000} endValue={5}/>
                    </div> */}
                    
                </div>
            </div>
            {section2}
        </section>
    )
}

export default ClientComponent