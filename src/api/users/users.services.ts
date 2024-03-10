import bcrypt from 'bcrypt';
import { db } from '../../utils/db'; // Adjust the path as needed
import  {User as dbUser } from '@prisma/client' ;
import {IRegisterUser, IUpdateUser} from "../auth/interfaces";
import {User} from "./models/user.model";

// Assuming `email` is a string and the function returns a Promise of a User or null
function findUserByEmail(email: string): Promise<dbUser | null> {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

function createUserByEmailAndPassword(payload: IRegisterUser): Promise<User> {
  const hashedPassword = bcrypt.hashSync(payload.password, 9);
  const userData: any = {};
  userData.name = payload.name;
  userData.email = payload.email;
  userData.password = hashedPassword;
  if (payload.avatars && payload.avatars.length > 0) {
    const data = [];
    for (const avatar of payload.avatars) {
      data.push({
        original: avatar,
      });
    }
    userData.avatars = {
      createMany: {
        data: data,
      },
    };
  }
  return db.user.create({
    data: {
      ...userData,
    },
  });
}
async function findUserById(id: string): Promise<User| null> {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    const {password, ...withoutPassword} = user;
    return withoutPassword;
  }
  return user;
}
async function updateUser(user: User, data: IUpdateUser): Promise<User>{
  const {name, bio,latitude, longitude} = data
  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: name ?? user.name,
      bio,
      latitude,
      longitude,
    },
    include: {
      avatars: true,
    },
  });
  const {password, ...withoutPassword}= updatedUser
  return withoutPassword;
}
async function getAllUsers(): Promise<User[]> {
  const users = await db.user.findMany();
  const finalResult: User[] = [];
  for (const user of users){
    const {password, ...withoutPassword} = user;
    finalResult.push(withoutPassword);
  }
  return finalResult;
}

async function likeUser(likerId: string, likedId: string): Promise<boolean> {
  const userLike = await db.userLike.findFirst({
    where: {
      liker_id: likerId,
      user_id: likedId,
    }
  });
  if (userLike) {
    return false;
  }
  await db.userLike.create({
    data: {
      liker: {
        connect: {
          id: likerId,
        },
      },
      user: {
        connect: {
          id: likedId,
        },
      },
    },
  });
  return true;
}

async function unlikeUser(likerId: string, likedId: string): Promise<boolean> {
  const userLike = await db.userLike.findFirst({
    where: {
      liker_id: likerId,
      user_id: likedId,
    }
  });
  if (!userLike) {
    return false;
  }

  await db.userLike.delete({
    where: {
      id: userLike.id,
    }
  });
  return true;
}

export { findUserByEmail, findUserById, createUserByEmailAndPassword, getAllUsers, updateUser, likeUser, unlikeUser };
