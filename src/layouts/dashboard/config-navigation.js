import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';
import { UsegetRoles } from 'src/api/roles';

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
  const { products: roles } = UsegetRoles();

  const { user } = useAuthContext();
  const role_id = user?.data?.role_id
  console.log("Nikhil25", user);

  const matchedRoleName = roles?.find((role) => role.id === role_id)?.role_name;



  const data = useMemo(
    () =>
      matchedRoleName === "Administrator " || matchedRoleName === "Admin" ?
        [
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
                title: t('Admin Centre'),
                icon: ICONS.label,
                path: [
                  paths.dashboard.roles.root,
                  paths.dashboard.roles.new,
                  paths.dashboard.amenities.root,
                  paths.dashboard.amenities.new,
                  paths.dashboard.propertytype.root,
                  paths.dashboard.propertytype.new,
                ],
                children: [
                  {
                    title: t('Roles'),
                    path: paths.dashboard.roles.root,
                    icon: ICONS.role,
                    children: [
                      { title: t('list'), path: paths.dashboard.roles.root },
                      { title: t('create new role'), path: paths.dashboard.roles.new },
                    ],
                  },
                  {
                    title: t('Amenities'),
                    path: paths.dashboard.amenities.root,
                    icon: ICONS.amenity,
                    children: [
                      { title: t('list'), path: paths.dashboard.amenities.root },
                      { title: t('create new amenity'), path: paths.dashboard.amenities.new },
                    ],
                  },
                  {
                    title: t('Property type'),
                    path: paths.dashboard.propertytype.root,
                    icon: ICONS.property,
                    children: [
                      { title: t('list'), path: paths.dashboard.propertytype.root },
                      { title: t('create new property type'), path: paths.dashboard.propertytype.new },
                    ],
                  },
                ],
              },
              {
                title: t('user'),
                path: paths.dashboard.user.root,
                icon: ICONS.user,
                children: [
                  { title: t('colleagues'), path: paths.dashboard.user.list },
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
                path: [paths.dashboard.leads.root, paths.dashboard.followup.new, paths.dashboard.followup.root],
                icon: ICONS.leads,
                children: [
                  // { title: t('list'), path: paths.dashboard.leads.list },
                  { title: t('Buyer'), path: paths.dashboard.leads.buyer },
                  { title: t('Seller'), path: paths.dashboard.leads.seller },
                  { title: t('create new lead'), path: paths.dashboard.leads.new },
                ],
              },
              // {
              //   title: t('Follow Up'),
              //   path: paths.dashboard.followup.root,
              //   icon: ICONS.propertylogo,
              //   children: [
              //     { title: t('list'), path: paths.dashboard.followup.root },
              //     { title: t('create new Follow Up'), path: paths.dashboard.followup.new },
              //   ],
              // },
              {
                title: t('Developers'),
                path: [paths.dashboard.propertypage.main],
                icon: ICONS.job,
                children: [
                  { title: t('all developers'), path: paths.dashboard.propertypage.root },
                  { title: t('create new developer'), path: paths.dashboard.propertypage.new },
                ],
              },
              {
                title: t('Calender'),
                path: [paths.dashboard.calendar],
                icon: ICONS.calendar,
                // children: [
                //   { title: t('list'), path: paths.dashboard.calendar },
                //   { title: t('create new developer'), path: paths.dashboard.propertypage.new },
                // ],
              },
              {
                title: t('Power Report'),
                path: [paths.dashboard.report],
                icon: ICONS.blog,
              },
              {
                title: t('Future prospects'),
                path: [paths.dashboard.opportunity.main],
                icon: ICONS.lock,
                children: [
                  { title: t('list'), path: paths.dashboard.opportunity.root },
                  { title: t('add prospect'), path: paths.dashboard.opportunity.new },
                ],
              },
              // {
              //   title: t('Menu'),
              //   path: [paths.dashboard.menu],
              //   icon: ICONS.propertylogo,
              // },
            ],
          },
        ] : [
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
                title: t('Admin Centre'),
                icon: ICONS.label,
                path: [
                  paths.dashboard.roles.root,
                  paths.dashboard.roles.new,
                  paths.dashboard.amenities.root,
                  paths.dashboard.amenities.new,
                  paths.dashboard.propertytype.root,
                  paths.dashboard.propertytype.new,
                ],
                children: [
                  {
                    title: t('Roles'),
                    path: paths.dashboard.roles.root,
                    icon: ICONS.role,
                    children: [
                      { title: t('list'), path: paths.dashboard.roles.root },
                      { title: t('create new role'), path: paths.dashboard.roles.new },
                    ],
                  },
                  {
                    title: t('Amenities'),
                    path: paths.dashboard.amenities.root,
                    icon: ICONS.amenity,
                    children: [
                      { title: t('list'), path: paths.dashboard.amenities.root },
                      { title: t('create new amenity'), path: paths.dashboard.amenities.new },
                    ],
                  },
                  {
                    title: t('Property type'),
                    path: paths.dashboard.propertytype.root,
                    icon: ICONS.property,
                    children: [
                      { title: t('list'), path: paths.dashboard.propertytype.root },
                      { title: t('create new property type'), path: paths.dashboard.propertytype.new },
                    ],
                  },
                ],
              },
              {
                title: t('user'),
                path: paths.dashboard.user.root,
                icon: ICONS.user,
                children: [
                  { title: t('colleagues'), path: paths.dashboard.user.list },
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
                path: [paths.dashboard.leads.root, paths.dashboard.followup.new, paths.dashboard.followup.root],
                icon: ICONS.leads,
                children: [
                  // { title: t('list'), path: paths.dashboard.leads.list },
                  { title: t('Buyer'), path: paths.dashboard.leads.buyer },
                  { title: t('Seller'), path: paths.dashboard.leads.seller },
                  { title: t('create new lead'), path: paths.dashboard.leads.new },
                ],
              },
              // {
              //   title: t('Follow Up'),
              //   path: paths.dashboard.followup.root,
              //   icon: ICONS.propertylogo,
              //   children: [
              //     { title: t('list'), path: paths.dashboard.followup.root },
              //     { title: t('create new Follow Up'), path: paths.dashboard.followup.new },
              //   ],
              // },
              {
                title: t('Developers'),
                path: [paths.dashboard.propertypage.main],
                icon: ICONS.job,
                children: [
                  { title: t('all developers'), path: paths.dashboard.propertypage.root },
                  { title: t('create new developer'), path: paths.dashboard.propertypage.new },
                ],
              },
              {
                title: t('Calender'),
                path: [paths.dashboard.calendar],
                icon: ICONS.calendar,
                // children: [
                //   { title: t('list'), path: paths.dashboard.calendar },
                //   { title: t('create new developer'), path: paths.dashboard.propertypage.new },
                // ],
              },
              {
                title: t('Power Report'),
                path: [paths.dashboard.report],
                icon: ICONS.blog,
              },
              {
                title: t('Future prospects'),
                path: [paths.dashboard.opportunity.main],
                icon: ICONS.lock,
                children: [
                  { title: t('list'), path: paths.dashboard.opportunity.root },
                  { title: t('add prospect'), path: paths.dashboard.opportunity.new },
                ],
              },
              // {
              //   title: t('Menu'),
              //   path: [paths.dashboard.menu],
              //   icon: ICONS.propertylogo,
              // },
            ],
          },
        ],
    [t, matchedRoleName]
  );

  return data;
}
