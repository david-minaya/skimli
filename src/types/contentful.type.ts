/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

export interface IFooterType {
  title: string;
  linkName: string;
  linkUrl: string;
  sys: {
    id: string;
  };
}

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

export interface IBrandsLogos {
  title: string;
  brands: IBrands[];
}

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

export interface ICustomerPersona {
  title: string;
  persona: IPersona[];
}

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

export interface IMajorAchievements {
  title: string;
  achievementSectionTitle: string;
  achievementsSectionDescription: string;
  achievementList: IAchievements[];
}

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

export interface ITestimonialSection {
  title: string;
  sectionTitle: string;
  sectionSubtitle: string;
  testimonialList: ITestimonial[];
}

export interface IFeature {
  title: string;
  featureTitle: string;
  featureDescription: string;
  featureImage: {
    title: string;
    url: string;
  };
}

export interface ITopFeatures {
  title: string;
  sectionTitle: string;
  sectionSubtitle: string;
  featureList: IFeature[];
}

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

export interface IAboutUsTeam {
  sectionTitle: string;
  teamPicture: { url: string; title: string };
}

export interface IAboutUsDescription {
  title: string;
  description: {
    json: any;
  };
}
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

export interface IFAQ {
  sys: {
    id: string;
  };
  question: string;
  answer: {
    json: any;
  };
}
