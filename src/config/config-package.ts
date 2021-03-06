'use strict';

import * as Joi from 'joi';
import { ApiConfig, apiConfigValidatorSchema } from './api';
import { ValidationError } from './errors';
import { GatewayConfig, gatewayConfigValidatorSchema } from './gateway';

/**
 * The Server config descriptor.
 */
export interface ConfigPackage {
    /**
     * The gateway configuration.
     */
    gateway?: GatewayConfig;
    /**
     * Configurations for apis.
     */
    apis?: Array<ApiConfig>;
    /**
     * Configurations for middlewares.
     */
    middlewares?: Array<MiddlewareConfig>;
}

export interface MiddlewareConfig {
    id?: string;
    middleware: string;
    name?: string;
    content: string;
}

export let configPackageValidatorSchema = Joi.object().keys({
    apis: Joi.array().items(apiConfigValidatorSchema),
    gateway: gatewayConfigValidatorSchema,
    middlewares: Joi.array().items(Joi.object().keys({
        content: Joi.string().required(),
        id: Joi.string(),
        middleware: Joi.string().required(),
        name: Joi.string()
    }).xor('id', 'name'))
});

export function validateConfigPackage(configPackage: ConfigPackage) {
    return new Promise((resolve, reject) => {
        Joi.validate(configPackage, configPackageValidatorSchema, (err, value) => {
            if (err) {
                reject(new ValidationError(err));
            } else {
                resolve(value);
            }
        });
    });
}
