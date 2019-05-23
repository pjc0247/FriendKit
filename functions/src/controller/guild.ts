import * as functions from 'firebase-functions';
import { DocumentReference, FieldValue } from "@google-cloud/firestore";
import { store } from "../common";
import { DateTime } from "luxon";
import { User } from "./user";
import { Alagolia } from '../thirdparty/algolia';

export interface GuildModel {
    name: string;

    owner: string;
    subOwner1: string;
    subOwner2: string;
}

export class Guild {
    public data?: GuildModel;

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

    constructor(private ref: DocumentReference, 
                data?: any) {
        this.data = data;
    }

    async getUsers() {
        let users = await User.users
             .where('guildId', '==', this.ref.id)
             .get();
        return users.docs.map(x => new User(x.ref, x.data()));
    }

    async update(property : any) {
        property = _.pick(property, ['name']);
        await this.ref.update(property);
    }

    async ensureDataExistInLocal() {
        if (this.data) return;
        this.data = (await this.ref.get()).data() as any;
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

exports.onGuildUpdated = functions.firestore.document('guid/{guid_id}/name').onWrite(async (snap, context) => {
    await Alagolia.getIndex('guild_name')
        .saveObject({
            objectID: context.params.guild_id,
            name: snap.after.data()
        });
});