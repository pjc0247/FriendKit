import { BaseController } from "./base_controller";
import { store } from "../common";
import { User } from "./user";
import { DocumentSnapshot } from "@google-cloud/firestore";

export interface MessageModel {
    senderId: string;
    receiverId: string;

    title: string;
    body: string;

    deleted: boolean;
}
export class Message extends BaseController<MessageModel> {
    public static get messages() { return store.collection('message'); }

    static async create(sender: User, receiver: User, data: any) {
        data = {
            ...data,
            deleted: false,
            senderId: sender.id,
            receiverId: receiver.id
        };

        let ref = await Message.messages.add(data);
        let message = new Message(ref, data);
        return message;
    }
    static get(uid: string) {
        let user = new Message(
            store.collection('user').doc(uid)
        );
        return user;
    }
    static async query(receiver: User) {
        const messages = (await Message.messages
            .where('receiverId', '==', receiver.id)
            .where('deleted', '==', false)
            .get())
            .docs;
        
        return messages.map(x => new Message(x.ref, x.data()));
    }

    async delete() {
        await this.update({
            deleted: true
        });
    }

    async update(property : any) {
        property = _.pick(property, ['deleted']);
        await this.ref.update(property);
    }

    async toExportable() {
        await this.ensureDataExistInLocal();
        let data = this.data!;
        
        return {
            id: this.ref.id,
            title: data.title,
            body: data.body,

            sender: User.get(data.senderId),
            receiver: User.get(data.receiverId)
        };
    }
}