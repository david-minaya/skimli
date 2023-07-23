/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

export interface AyrshareNewProfile {
  status: string;
  title: string;
  refId: string;
  profileKey: string;
}
export interface AyrshareApiError {
  status: "error";
  errors?: AyrshareApiErrorItem[];
  postIds?: string[];
  id?: string;
  post?: string;
  singularError?: AyrshareApiSingularError;
}

export interface AyrshareApiErrorItem {
  action: string;
  status: "error";
  code: number;
  message: string;
  post?: string;
  platform: string;
}

export interface AyrshareApiSingularError {
  action: string;
  status: "error";
  code: number;
  message: string;
}

export interface AyrshareCreateProfileRequest {
  title: string;
}

export type AyrshareCreateProfileResponse = AyrshareNewProfile;

export interface AyrshareJwt {
  status: string;
  title: string;
  token: string;
  url: string;
  emailSent: boolean;
  expiresIn: string;
}
export interface AyrshareGenerateJwtRequest {
  profileKey: string;
}

export type AyrshareGenerateJwtResponse = AyrshareJwt;

export interface AyrshareUserProfile {
  activeSocialAccounts: AyrsharePlatform[] | never[];
  created: {
    _seconds: number;
    _nanoseconds: number;
    utc: string;
  };
  displayNames: AyrshareUserProfileDisplayName[] | never[];
  email: null;
  monthlyApiCalls: number;
  refId: string;
  title: string;
  lastUpdated: string;
  nextUpdate: string;
}

export interface AyrshareUserProfileDisplayName {
  created: string;
  displayName: string;
  id: string;
  platform: AyrsharePlatform;
  profileUrl: string;
  userImage?: string;
  userName?: string;
  refreshDaysRemaining?: number;
  refreshRequired?: string;
  type?: string;
}

export enum AyrsharePlatform {
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  LINKEDIN = "linkedin",
  PINTEREST = "pinterest",
  TIKTOK = "tiktok",
  TWITTER = "twitter",
  YOUTUBE = "youtube",
}

export interface AyrshareGetUserRequest {
  profileKey: string;
}

export type AyrshareGetUserResponse = AyrshareUserProfile;
