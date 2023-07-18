/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {AxiosError} from 'axios';

export interface IUserIntegrations {
    currentIntegrations?: IUserIntegration[];
    availableIntegrations?: IUserIntegration[];
    upgradeRequiredIntegrations?: IUserIntegration[];
}

export interface IUserIntegration {
    code: IntegrationCodeType;
    category: IntegrationCategoryType;
}

export enum IntegrationCategoryType {
    CLOUD_DRIVE = "CLOUD_DRIVE",
    CLOUD_STORAGE = "CLOUD_STORAGE",
    CMS = "CMS",
    SOCIAL_MEDIA = "SOCIAL_MEDIA",
    VIDEO_SERVICE = "VIDEO_SERVICE",
    DAM = "DAM",
}

export enum IntegrationCodeType {
    FACEBOOK = "social-media-facebook",
    INSTAGRAM = "social-media-instagram",
    PINTEREST = "social-media-pinterest",
    TIKTOK = "social-media-tiktok",
    YOUTUBE = "social-media-youtube",
    TWITTER = "social-media-twitter",
    LINKEDIN = "social-media-linkedin",
    GOOGLE_DRIVE = "cloud-drive-google-drive",
    ONE_DRIVE = "cloud-drive-one-drive",
    BOX = "cloud-drive-box",
    DROPBOX = "cloud-drive-dropbox",
    VIMEO = "video-service-vimeo",
    TWITCH = "video-service-twitch",
    HUBSPOT = "cms-hubspot",
    CONTENTFUL = "cms-contentful",
    S3 = "cloud-storage-s3",
    AZURE = "cloud-storage-azure",
    GCP = "cloud-storage-gcp",
    FRAME_IO = "dam-frame-io",
}

export enum IntegrationFeatureType {
    SOCIAL_MEDIA_PUBLISHING = "SOCIAL_MEDIA_PUBLISHING",
    CLOUD_DRIVE_INTEGRATIONS = "CLOUD_DRIVE_INTEGRATIONS",
    VIDEO_SYSTEM_INTEGRATIONS = "VIDEO_SYSTEM_INTEGRATIONS",
}

export interface CheckUserIntegrationsUpgradesParams {
    currentFeatures: IntegrationFeatureType[];
}

export type CheckUserIntegrationsUpgradesResponse = [IUserIntegration[] | null, AxiosError | null];

export interface CheckUserIntegrationsAvailableParams {
    idpUser: string;
    currentFeatures: IntegrationFeatureType[];
}

export type CheckUserIntegrationsAvailableResponse = [IUserIntegration[] | null, AxiosError | null];

export interface CheckUserIntegrationsCurrentParams {
    idpUser: string,
}

export type CheckUserIntegrationsCurrentResponse = [IUserIntegration[] | null, AxiosError | null];
