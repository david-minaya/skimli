/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

export interface UserIntegrations {
  currentIntegrations?: UserIntegration[];
  availableIntegrations?: UserIntegration[];
  upgradeRequiredIntegrations?: UserIntegration[];
}

export interface UserIntegration {
  code: IntegrationCodeType;
  category: IntegrationCategoryType;
  displayName?: string;
  userImage?: string;
}

export enum IntegrationCategoryType {
  CLOUD_DRIVE = 'CLOUD_DRIVE',
  CLOUD_STORAGE = 'CLOUD_STORAGE',
  CMS = 'CMS',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  VIDEO_SERVICE = 'VIDEO_SERVICE',
  DAM = 'DAM',
}

export enum IntegrationCodeType {
  FACEBOOK = 'social-media-facebook',
  INSTAGRAM = 'social-media-instagram',
  PINTEREST = 'social-media-pinterest',
  TIKTOK = 'social-media-tiktok',
  YOUTUBE = 'social-media-youtube',
  TWITTER = 'social-media-twitter',
  LINKEDIN = 'social-media-linkedin',
  GOOGLE_DRIVE = 'cloud-drive-google-drive',
  ONE_DRIVE = 'cloud-drive-one-drive',
  BOX = 'cloud-drive-box',
  DROPBOX = 'cloud-drive-dropbox',
  VIMEO = 'video-service-vimeo',
  TWITCH = 'video-service-twitch',
  HUBSPOT = 'cms-hubspot',
  CONTENTFUL = 'cms-contentful',
  S3 = 'cloud-storage-s3',
  AZURE = 'cloud-storage-azure',
  GCP = 'cloud-storage-gcp',
  FRAME_IO = 'dam-frame-io',
}

export interface AyrshareJwt {
  status: string;
  title: string;
  token: string;
  url: string;
  emailSent: boolean;
  expiresIn: string;
}
