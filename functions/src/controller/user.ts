import * as functions from 'firebase-functions';
import { DocumentReference, FieldValue, Firestore } from "@google-cloud/firestore";
import { store } from "../common";
import { DateTime } from "luxon";
import { InvalidOperationError } from "../error";
import { BaseController } from "./base_controller";
import { InventoryItem, ItemType } from "../model/item";
import { Equipments } from "../model/equipments";
import { firestore } from 'firebase-admin';

export interface UserModel {
    name: string;
    character: string;  // 외형

    guildId?: string;
    requestingGuildId?: string;

    friends: string[];
    friendRequested: string[];

    balances: {[key: string]: number};

    inventory: InventoryItem[];
    equipments: Equipments;

    presence: Date;
}

export class User extends BaseController<UserModel> {
    public static get users() { return store.collection('user'); }
    public get uid() { return this.ref.id; }
    private get friendRequestedRef() { return this.ref.collection('friendRequested') }

    static get(uid: string) {
        let user = new User(
            store.collection('user').doc(uid)
        );
        return user;
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

    async joinGuild(guildId: string) {
        await this.update({
            guild: guildId
        });
    }
    async leaveGuild() {
        await this.update({
            guild: null
        });
    }

    async credit(key: string, value: number) {
        if (value <= 0)
            throw new InvalidOperationError('Credit value must be greater than zero');

        await this.ref.update({
            balances: {
                key: FieldValue.increment(value)
            }
        })
    }
    async withdraw(key: string, value: number) {
        if (value <= 0)
            throw new InvalidOperationError('Withdraw value must be greater than zero');

        await store.runTransaction(async (tx) => {
            let user = (await tx.get(this.ref)).data() as UserModel;
            if (!user.balances[key] &&
                user.balances[key] <= 0) {
                throw new InvalidOperationError('Insufficient value');
            }

            tx.update(this.ref, {
                balances: {
                    key: FieldValue.increment(-value)
                }
            });
        });
    }

    async update(property : any) {
        property = _.pick(property, ['name', 'character']);
        await this.ref.update(property);
    }
    async updatePresence() {
        await this.ref.update({
            presence: FieldValue.serverTimestamp()
        })
    }

    async addItem(name: string, quantity: number) {
        let inventory = this.data!.inventory;
        const idx = inventory.findIndex(x => x.id == name);
        
        if (idx == -1) {
            inventory.push({
                id: name,
                quantity   
            });
        }
        else 
            inventory[idx].quantity += quantity;

        await this.update({
            inventory
        });
    }
    async consumeItem(name: string, quantity: number) {
        let inventory = this.data!.inventory;
        const idx = inventory.findIndex(x => x.id == name);
        
        if (idx == -1)
            throw new InvalidOperationError('item does not exist');
        if (inventory[idx].quantity < quantity)
            throw new InvalidOperationError('insufficient item quantity');

        inventory[idx].quantity -= quantity;
        if (inventory[idx].quantity == 0)
            delete inventory[idx];

        await this.update({
            inventory
        });
    }
    hasItem(name: string, quantity = 1) {
        let inventory = this.data!.inventory;
        const idx = inventory.findIndex(x => x.id == name);

        if (idx == -1) return false;
        if (inventory[idx].quantity >= quantity)
            return true;
        return false;
    }
    async stashItem(name: string) {
        await this.update({
            inventory: this.data!.inventory
                .filter(x => x.id !== name)
        });
    }

    async equip(item: InventoryItem) {
        if (item.type == ItemType.None)
            return false;

        let equipments: {[key: string]: InventoryItem} = {};
        switch (item.type) {
            case ItemType.Head: 
                equipments.head = item;
                break;
            case ItemType.Weapon:
                equipments.weapon = item;
                break;
            case ItemType.Shield:
                equipments.shield = item;
                break;
        }

        await this.update({
            equipments
        });

        return true;
    }

    async toExportable() {
        await this.ensureDataExistInLocal();
        let data = this.data!;
        
        return {
            id: this.ref.id,
            nickname: data.name,
            presence: 
                DateTime.fromJSDate(data.presence).diffNow().minutes <= 10 ?
                'online' : 'offline'
        };
    }
}

exports.onUserCreated = functions.firestore.document('user').onCreate(async (snap, context) => {
    // Present default equipments
    await snap.ref.update({
        equipments: {

        }
    });
});