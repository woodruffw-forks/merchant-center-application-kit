// eslint-disable-next-line import/extensions
import { PERMISSIONS, entryPointUriPath } from './src/constants.js';

const name = 'AppKit Playground Application';

const productionUrl = process.env.VERCEL_ENV !== 'production' && Boolean(process.env.VERCEL_URL) ?
  `https://${process.env.VERCEL_URL}` :
  process.env.APP_URL;

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name,
  entryPointUriPath,
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  mcApiUrl: '${env:MC_API_URL}',
  oAuthScopes: {
    view: ['view_orders', 'view_states', 'view_products'],
    manage: [],
  },
  env: {
    development: {
      initialProjectKey: '${env:CTP_INITIAL_PROJECT_KEY}',
    },
    production: {
      applicationId: '${env:APP_ID}',
      url: productionUrl,
    },
  },
  additionalEnv: {
    trackingSentry:
      'https://327619347ab84c8e9702a1dc16460198@o32365.ingest.sentry.io/1549825',
    echoServerApiUrl: '${env:ECHO_SERVER_URL}',
    ldClientSideId: '${env:LD_CLIENT_ID_STAGING}',
  },
  headers: {
    csp: {
      'connect-src': ['${env:HOST_GCP_STAGING}'],
    },
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: '${intl:en:Menu.StateMachines}',
    labelAllLocales: [
      {
        locale: 'en',
        value: '${intl:en:Menu.StateMachines}',
      },
      {
        locale: 'de',
        value: '${intl:de:Menu.StateMachines}',
      },
    ],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'notifications',
      permissions: [PERMISSIONS.View],
      defaultLabel: 'Notifications',
      labelAllLocales: [],
    },
    {
      uriPath: 'echo-server',
      permissions: [PERMISSIONS.View],
      defaultLabel: '${intl:en:Menu.EchoServer}',
      labelAllLocales: [
        {
          locale: 'en',
          value: '${intl:en:Menu.EchoServer}',
        },
        {
          locale: 'de',
          value: '${intl:de:Menu.EchoServer}',
        },
      ],
    },
    {
      uriPath: 'formatters',
      permissions: [PERMISSIONS.View],
      defaultLabel: 'Formatters',
      labelAllLocales: [],
    },
    {
      uriPath: 'custom-panel',
      permissions: [PERMISSIONS.View],
      defaultLabel: 'Custom Panel',
      labelAllLocales: [],
    },
  ],
};

export default config;
