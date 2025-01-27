'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { UsegetFollowupDetail, UsegetFollowupProperty } from 'src/api/leads';
import FollowupForm from '../Followup-new-edit-form';


// ----------------------------------------------------------------------

export default function FollowupCardsView({ id }) {
    const settings = useSettingsContext();

    const { product: currentProperty } = UsegetFollowupDetail(id);

    console.log("+++++++", currentProperty);

    const data = {
        lead_first_name: currentProperty?.first_name,
        lead_last_name: currentProperty?.last_name
    }


    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Lead Follow-up Status"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root }, {
                        name: 'Leads',
                        href: paths.dashboard.leads.list,
                    },
                    { name: 'FollowUp', href: `${paths.dashboard.followup.root}?id=${id}` },

                    { name: 'New' },
                ]}

                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <FollowupForm id={id} currentUser={data} />
        </Container>
    );
}
