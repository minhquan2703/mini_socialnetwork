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