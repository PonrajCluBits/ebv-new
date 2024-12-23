/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

// import { AuthContext } from 'src/sections/auth/authContext';

// eslint-disable-next-line import/order

// ----------------------------------------------------------------------

export const IndexPage = lazy(() => import('src/pages/app'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const EligibilityPage = lazy(() => import('src/pages/eligibilityPage'));
export const PatientBenefitPage = lazy(() => import('src/pages/eligibilityPage/patientBenefitPage'));
export const PatientBenefitReportPage = lazy(() => import('src/pages/eligibilityPage/patientBenefitPage/report'));
export const ChatbotComponent = lazy(() => import('src/pages/chatBot'));
// eslint-disable-next-line import/no-unresolved

export default function Router() {
  // const { user } = useContext(AuthContext)

  const user = JSON.parse(localStorage.getItem('userData'));

  const routes = useRoutes([
    user?.accessToken
      ? {
          element: (
            <DashboardLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          ),
          children: [
            { element: <IndexPage />, index: true },
            {
              path: '/eligibility-verification',
              element: <EligibilityPage />,
            },
            {
              path: 'eligibility-verification/patient-benefit-information/:param',
              element: <PatientBenefitPage />,
            },
            {
              path: 'eligibility-verification/patient-benefit-information/report/:param',
              element: <PatientBenefitReportPage />,
            },
            {
              path: '/chatBot',
              element: <ChatbotComponent />,
            },
            {
              path: '/eligibility-history',
              element: <div>Eligibility History</div>,
            },
            {
              path: '/eligibility-ai',
              element: <div>Eligibility AI</div>,
            },
            {
              path: '/integrations',
              element: <div>Integrations</div>,
            },
            {
              path: '/settings',
              element: <div>Integrations</div>,
            },
            {
              path: '/admin',
              element: <div>Admin</div>,
            },
            {
              path: '/chatbot',
              element: <div>Chatbot</div>,
            },
            {
              path: '/bi',
              element: <div>BI</div>,
            },
            {
              path: '/report',
              element: <div>Report</div>,
            },
            {
              path: '/faq',
              element: <div>FAQ</div>,
            },
          ],
        }
      : {
          path: '*',
          element: <Navigate to="/login" replace />,
        },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
  ]);

  return routes;
}
