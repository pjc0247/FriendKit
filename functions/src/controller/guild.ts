import * as functions from 'firebase-functions';
import { DocumentReference, FieldValue } from "@google-cloud/firestore";
import { store } from "../common";
import { DateTime } from "luxon";
import { User } from "./user";
import { Alagolia } from '../thirdparty/algolia';
import { BaseController } from './base_controller';

export enum GuildGrade {
    Bronze, Silver, Gold, Platinum, Diamond
};

export interface GuildModel {
    name: string;

    owner: string;
    subOwner1: string;
    subOwner2: string;

    memberCount: number;
}

export class Guild extends BaseController<GuildModel> {
    public static get guilds() { return store.collection('guild'); }

    static async create(owner: User, name: string) {
        let data = {
            owner: owner.uid,
            name
        };
        let ref = await Guild.guilds.add(data);
        let guild = new Guild(ref, data);
        return guild;
    }
    static get(uid: string) {
        let guild = new Guild(
            Guild.guilds.doc(uid)
        );
        return guild;
    }
    static async query(name: string): Promise<Guild[]> {
        let results = await Alagolia.getIndex('guild_name')
            .search(name);
        let guilds = [];
        for (const hit of results.hits) {
            guilds.push(new Guild(
                Guild.guilds.doc(hit.objectID)
            ));
        }
        return guilds;
    }
    
    async getUsers() {
        let users = await User.users
             .where('guildId', '==', this.ref.id)
             .get();
        return users.docs.map(x => new User(x.ref, x.data()));
    }

    async requestJoin(user: User) {
        await user.update({
            requestingGuildId: this.id
        });
    }
    async acceptRequest(user: User) {
        await user.update({
            guildId: this.id,
            requestingGuildId: null
        });
    }
    async rejectRequest(user: User) {
        await user.update({
            requestingGuildId: null
        });
    }

    async update(property : any) {
        property = _.pick(property, ['name']);
        await this.ref.update(property);
    }

    async toExportable() {
        await this.ensureDataExistInLocal();
        let data = this.data!;

        return {
            id: this.ref.id,
            name: data.name,
            owner: User.get(data.owner)
        }
    }
}

exports.onGuildUpdated = functions.firestore.document('guild/{guild_id}/name').onWrite(async (snap, context) => {
    await Alagolia.getIndex('guild_name')
        .saveObject({
            objectID: context.params.guild_id,
            name: snap.after.data()
        });
});