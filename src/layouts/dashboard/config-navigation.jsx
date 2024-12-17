import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('chart-bar'),
  },
  {
    title: 'Eligibility',
    icon: icon('eligibility'),
    children: [
      {
        title: 'Eligibility Verification',
        path: '/eligibility-verification',
        // icon: icon('user'),
      },
      {
        title: 'History',
        path: '/eligibility-history',
      },
    ]
  },
  {
    title: 'Eligibility AI',
    path: '/eligibility-ai',
    icon: icon('eligibility'),
  },
  {
    title: 'Integrations',
    path: '/integrations',
    icon: icon('integration'),
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: icon('settings'),
  },
  {
    title: 'Admin',
    path: '/admin',
    icon: icon('admin'),
  },
  {
    title: 'Chatbot',
    path: '/chatbot',
    icon: icon('chatbot'),
  },
  {
    title: 'BI',
    path: '/bi',
    icon: icon('analytics'),
  },
  {
    title: 'Report',
    path: '/report',
    icon: icon('report'),
  },
  {
    title: 'FAQ',
    path: '/faq',
    icon: icon('faq'),
  },
];

export default navConfig;
