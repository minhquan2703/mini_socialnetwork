export interface IRoom {
    id: string;
    type: string;
    receiver: {
        id: string;
        avatarColor: string;
        image: string;
        name: string;
        username: string;
    };
    lastestMessage?: {
        content: string;
        createdAt: string;
        id: string;
        timeBefore: string;
        sender: {
            id: string;
            avatarColor: string;
            image: string;
            name: string;
            username: string;
        };
    };
}
export interface UserInRoom {
    id: string;
    name: string;
    username: string;
    avatarColor: string;
    image: string;
}
export interface IDetailRoom {
    id: string;
    theme?: string;
    avatar?: string;
    type: string;
    name: string;
    users: UserInRoom[];
}
