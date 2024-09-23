"use client";
import { useSearchParams } from 'next/navigation';
import React from 'react';
import FollowupListView from 'src/sections/followup/view/Followup-list-view';

const Page = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    return (
        <div>
            <FollowupListView id={id} />
        </div>
    );
}

export default Page;
