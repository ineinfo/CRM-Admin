import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  role: icon('ic_roles'),
  amenity: icon('ic_amenity'),
  property: icon('ic_property'),
  clients: icon('ic_clients'),
  leads: icon('ic_leads'),
  propertylogo: icon('ic_properties'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      {
        subheader: t('overview'),
        items: [
          {
            title: t('Dashboard'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },
      {
        subheader: t('management'),
        items: [
          {
            title: t('Raw masters'),
            icon: ICONS.blank,
            path: [
              paths.dashboard.roles.root,
              paths.dashboard.roles.new,
              paths.dashboard.amenities.root,
              paths.dashboard.amenities.new,
            ],
            children: [
              {
                title: t('Roles'),
                path: paths.dashboard.roles.root,
                icon: ICONS.role,
                children: [
                  { title: t('list'), path: paths.dashboard.roles.root },
                  { title: t('create'), path: paths.dashboard.roles.new },
                ],
              },
              {
                title: t('Amenities'),
                path: paths.dashboard.amenities.root,
                icon: ICONS.amenity,
                children: [
                  { title: t('list'), path: paths.dashboard.amenities.root },
                  { title: t('create'), path: paths.dashboard.amenities.new },
                ],
              },
              {
                title: t('Property type'),
                path: paths.dashboard.propertytype.root,
                icon: ICONS.property,
                children: [
                  { title: t('list'), path: paths.dashboard.propertytype.root },
                  { title: t('create'), path: paths.dashboard.propertytype.new },
                ],
              },
            ],
          },
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: t('list'), path: paths.dashboard.user.list },
              { title: t('create new user'), path: paths.dashboard.user.new },
            ],
          },
          // {
          //   title: t('Clients'),
          //   path: paths.dashboard.clients.root,
          //   icon: ICONS.clients,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.clients.list },
          //     { title: t('create'), path: paths.dashboard.clients.new }
          //   ],
          // },
          {
            title: t('Leads'),
            path: paths.dashboard.leads.root,
            icon: ICONS.leads,
            children: [
              { title: t('list'), path: paths.dashboard.leads.list },
              { title: t('create new lead'), path: paths.dashboard.leads.new },
            ],
          },
          {
            title: t('Developers'),
            path: paths.dashboard.propertypage.root,
            icon: ICONS.propertylogo,
            children: [
              { title: t('list'), path: paths.dashboard.propertypage.root },
              { title: t('create new developer'), path: paths.dashboard.propertypage.new },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
