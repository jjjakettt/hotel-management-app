'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/libs/translations';

type Props = {
    section2: React.ReactNode;
}

const ClientComponent: FC<Props> = (props) => {
    const { section2 } = props;
    const { t } = useTranslation();

    return (
        <section className="flex px-4 items-center gap-12 container mx-auto">
            <div className="py-10 h-full">
                <h1 className="font-heading mb-6">
                    {t("hero.title")}
                </h1>
                <p className="mb-12 max-w-lg">
                    {t("hero.subtitle")}
                </p>
                <Link href="/rooms" className="btn-primary">
                    {t("hero.cta")}
                </Link>

                <div className="flex justify-between mt-12">
                </div>
            </div>
            {section2}
        </section>
    )
}

export default ClientComponent
