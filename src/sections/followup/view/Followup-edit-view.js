'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { UsegetProperty } from 'src/api/properties';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { UsegetFollowupProperty } from 'src/api/leads';
import FollowupForm from '../Followup-new-edit-form';


// ----------------------------------------------------------------------

export default function FollowupEditView({ id }) {
    const settings = useSettingsContext();
    const { product: currentProperty } = UsegetFollowupProperty(id);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Edit"
                links={[
                    {
                        name: 'Dashboard',
                        href: paths.dashboard.list,
                    }, {
                        name: 'Leads',
                        href: paths.dashboard.leads.list,
                    },
                    { name: 'FollowUp', href: `${paths.dashboard.followup.root}?id=${id}` },
                    { name: `Edit` },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <FollowupForm currentUser={currentProperty} />
        </Container>
    );
}

FollowupEditView.propTypes = {
    id: PropTypes.string,
};
