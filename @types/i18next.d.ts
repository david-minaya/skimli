import 'i18next'

import type common from '../public/locales/en/common.json';
import type components from '../public/locales/en/components.json';
import type library from '../public/locales/en/library.json';
import type billing from '../public/locales/en/billing.json';
import type profile from '../public/locales/en/profile.json';
import type onboarding from '../public/locales/en/onboarding.json';
import type page401 from '../public/locales/en/page401.json';
import type page404 from '../public/locales/en/page404.json';
import type page500 from '../public/locales/en/page500.json';

declare module 'i18next' {

  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      library: typeof library
      billing: typeof billing
      profile: typeof profile
      onboarding: typeof onboarding
      components: typeof components
      page401: typeof page401
      page404: typeof page404
      page500: typeof page500
    }
  }
}
