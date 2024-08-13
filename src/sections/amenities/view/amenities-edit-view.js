'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { UsegetAmenity } from 'src/api/amenities';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductNewEditForm from '../amenities-new-edit-form';


// ----------------------------------------------------------------------

export default function ProductEditView({ id }) {
  const settings = useSettingsContext();

  const { product: currentProduct } = UsegetAmenity(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Amenities',
            href: paths.dashboard.amenities.root,
          },
          { name: `Edit` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}

ProductEditView.propTypes = {
  id: PropTypes.string,
};
