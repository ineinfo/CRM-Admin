'use client';

import PropTypes from 'prop-types';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import { DownloadProvider } from 'src/sections/leads/DownloadContext';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <DownloadProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </DownloadProvider>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
