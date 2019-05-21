import { DocumentReference, FieldValue } from "@google-cloud/firestore";
import { store } from "./common";
import { DateTime } from "luxon";

export interface UserModel {
    nickname: string;

    friends: string[];
    friendRequested: string[];

    presence: Date;
}

export class User {
    public data?: UserModel;

    private static get users() { return store.collection('user'); }
    public get uid() { return this.ref.id; }
    private get friendRequestedRef() { return this.ref.collection('friendRequested') }

    static get(uid: string) {
        let user = new User(
            store.collection('user').doc(uid)
        );
        return user;
    }

    constructor(private ref: DocumentReference, 
                data?: any) {
        this.data = data;
    }

    async getFriends() {
        let friends = await User.users
             .where('friends', 'array-contains', this.ref.id)
             .get();
        return friends.docs.map(x => new User(x.ref, x.data()));
    }
    async getFriendRequestsFromMe() {
        let friends = await User.users
             .where('friendRequested', 'array-contains', this.ref.id)
             .get();
        return friends.docs.map(x => new User(x.ref, x.data()));
    }
    async getFriendRequestsToMe() {
        let friends = await this.friendRequestedRef.get();
        return friends.docs.map(x => new User(x.ref, x.data()));
    }

    async requestFriend(user: User) {
        await user.ref.update({
            'friendRequested': FieldValue.arrayUnion(this.uid)
        });
    }
    async acceptRequest(user: User) {
        await this.ref.update({
            'friends': FieldValue.arrayUnion(user.uid),
            'friendRequested': FieldValue.arrayRemove(user.uid)
        });
        await user.ref.update({
            'friends': FieldValue.arrayUnion(this.uid)
        });
    }
    async rejectRequest(user: User) {
        await this.ref.update({
            'friendRequested': FieldValue.arrayRemove(user.uid)
        })
    }

    async setNickname(nickname: string) {
        await this.ref.update({
            nickname
        });
    }
    async updatePresence() {
        await this.ref.update({
            presence: FieldValue.serverTimestamp()
        })
    }

    async ensureDataExistInLocal() {
        if (this.data) return;
        this.data = (await this.ref.get()).data() as any;
    }

    toExportable() {
        let data = this.data!;
        
        return {
            nickname: data.nickname,
            presence: 
                DateTime.fromJSDate(data.presence).diffNow().minutes <= 10 ?
                'online' : 'offline'
        };
    }
}