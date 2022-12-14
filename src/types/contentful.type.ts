/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

// TODO: Remove type, not in webapp
export interface IFooterType {
  title: string;
  linkName: string;
  linkUrl: string;
  sys: {
    id: string;
  };
}

// TODO: Remove type, not in webapp
interface IBrands {
  title: string;
  order: number;
  logoImage: {
    url: string;
  };
  sys: {
    id: string;
  };
}

// TODO: Remove type, not in webapp
export interface IBrandsLogos {
  title: string;
  brands: IBrands[];
}

// TODO: Remove type, not in webapp
export interface IPersona {
  title: string;
  order: number;
  personaTitle: string;
  personaSubtitle: string;
  personaDescription: string;
  personaImage: {
    url: string;
  };
  sys: {
    id: string;
  };
}

// TODO: Remove type, not in webapp
export interface ICustomerPersona {
  title: string;
  persona: IPersona[];
}

// TODO: Remove type, not in webapp
interface IAchievements {
  title: string;
  achievementTitle: string;
  achievementDescription: string;
  achievementIcon: {
    url: string;
  };
  sys: {
    id: string;
  };
  order: number;
}

// TODO: Remove type, not in webapp
export interface IMajorAchievements {
  title: string;
  achievementSectionTitle: string;
  achievementsSectionDescription: string;
  achievementList: IAchievements[];
}

// TODO: Remove type, not in webapp
export interface ITestimonial {
  sys: {
    id: string;
  };
  title: string;
  order: number;
  userName: string;
  userMainVideoChannel: string;
  countryFlag: {
    title: string;
    url: string;
  };
  userTestimonial: string;
  userVideoIcon: {
    title: string;
    url: string;
  };
  userVideoLink: string;
  userSourceVideoLink: string;
  userSourceVideoIcon: {
    title: string;
    url: string;
  };
}
// TODO: Remove type, not in webapp
export interface ITestimonialSection {
  title: string;
  sectionTitle: string;
  sectionSubtitle: string;
  testimonialList: ITestimonial[];
}

// TODO: Remove type, not in webapp
export interface IFeature {
  title: string;
  featureTitle: string;
  featureDescription: string;
  featureImage: {
    title: string;
    url: string;
  };
}

// TODO: Remove type, not in webapp
export interface ITopFeatures {
  title: string;
  sectionTitle: string;
  sectionSubtitle: string;
  featureList: IFeature[];
}

// TODO: Remove type, not in webapp
interface feature {
  feature: string;
  toolTip?: string;
}

export interface ISubscriptionPlan {
  title: string;
  planName: string;
  buttonName: string;
  stripeProductId: string | null;
  order: number;
  monthlyPrice: string;
  mostPopular: boolean;
  features: {
    description?: string;
    list: feature[];
  };
  sys: {
    id: string;
  };
}

// TODO: Remove type, not in webapp
export interface IAboutUsTeam {
  sectionTitle: string;
  teamPicture: { url: string; title: string };
}
// TODO: Remove type, not in webapp
export interface IAboutUsDescription {
  title: string;
  description: {
    json: any;
  };
}

// TODO: Remove type, not in webapp
export interface IAboutUsTimelineItem {
  title: string;
  timelineItemTitle: string;
  timelineItemDescription: string;
  timelineItemDate: string;
  order: number;
}

export interface ILegalDoc {
  title: string;
  pagePath: string;
  pageTitle: string;
  termlyUrl: string;
}

// TODO: Remove type, not in webapp
export interface IFAQ {
  sys: {
    id: string;
  };
  question: string;
  answer: {
    json: any;
  };
}
