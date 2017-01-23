"use strict";

import "es6-promise";

import {Path, GET, POST, DELETE, PUT, PathParam, Errors, Return, Accept} from "typescript-rest";

import {Group, validateGroup} from "../../config/group";

import {RedisGroupService} from "../../service/redis";

import {RestController} from "./admin-util";

@Path('apis/:apiId/groups')
export class GroupRest extends RestController {

    @GET
    list(@PathParam("apiId") apiId: string): Promise<Array<Group>>{
        return this.service.list(apiId);
    }

    @POST
    addGroup(@PathParam("apiId") apiId: string, group: Group): Promise<string> {
        return new Promise((resolve, reject) => {
            validateGroup(group)
                .catch(err => {
                    throw new Errors.ForbidenError(JSON.stringify(err));
                })
                .then(() => this.service.create(apiId, group))
                .then(groupId => resolve(new Return.NewResource(`apis/${apiId}/groups/${groupId}`)))
                .catch(reject);
        });
    }

    @PUT
    @Path("/:groupId")
    updateGroup(@PathParam("apiId") apiId: string,
              @PathParam("groupId") groupId: string,
              group: Group): Promise<string> {
        return new Promise((resolve, reject) => {
            validateGroup(group)
                .catch(err => {
                    throw new Errors.ForbidenError(JSON.stringify(err));
                })
                .then(() => this.service.update(apiId, groupId, group))
                .then(() => resolve())
                .catch((err) => reject(this.handleError(err)));
        });
    }

    @DELETE
    @Path("/:groupId")
    deleteGroup(@PathParam("apiId") apiId: string,
                @PathParam("groupId") groupId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.service.remove(apiId, groupId)
                .then(() => resolve())
                .catch((err) => reject(this.handleError(err)));
        });
    }

    @GET
    @Path("/:groupId")
    getGroup(@PathParam("apiId") apiId: string,
             @PathParam("groupId") groupId: string) : Promise<Group>{
        return new Promise((resolve, reject) => {
            this.service.get(apiId, groupId)
                .then(resolve)
                .catch((err) => reject(this.handleError(err)));
        });
    }

    get serviceClass() {
        return RedisGroupService;
    }
}