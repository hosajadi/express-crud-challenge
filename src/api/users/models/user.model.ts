import { UserAvatar } from "@prisma/client";

export interface User {
    id: string;
    name: string;
    email: string;
    avatars?: UserAvatar[]
    bio?: string | null;
    latitude?:string | null;
    longitude?:string | null;
    createdAt:Date;
    updatedAt:Date;
}
