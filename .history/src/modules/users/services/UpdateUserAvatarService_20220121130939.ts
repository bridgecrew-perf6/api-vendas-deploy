import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import uploadConfig from '@config/uploads';
import path from 'path';
import fs from 'fs';
import User from '../typeorm/entities/User';
import DiskStorageProvider from '@shared/providers/storageProvider/DiskStorageProvider';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        const usersRepository = getCustomRepository(UsersRepository);
        const storageProvider = new DiskStorageProvider();

        const user = await usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        if (user.avatar) {
            await storageProvider.deleteFile(user.avatar);
        }

        const filename = await storageProvider.saveFile(avatarFilename);

        user.avatar = filename;

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;