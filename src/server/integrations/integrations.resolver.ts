/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */


import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import type { GraphQLContext } from "../schema";
import {IntegrationsService} from './integrations.service';
import {UserIntegrations} from "./integrations.types";
import {AuthInfo} from '../types/base.types';

@Service()
@Resolver()
export class IntegrationsResolver {
    constructor(private readonly integrationsService: IntegrationsService) {}

    @Authorized()
    @Query(() => UserIntegrations, {nullable: true})
    async getUserIntegrations(@Ctx() ctx: GraphQLContext): Promise<UserIntegrations | null> {
        const authInfo: AuthInfo = { auth0: ctx.auth0, token: ctx.token };
        return this.integrationsService.getUserIntegrations(authInfo);
    }
}