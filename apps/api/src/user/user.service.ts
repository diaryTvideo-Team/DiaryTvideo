import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { toUserSafe } from "./mapper/user-safe.mapper";
import { PasswordService } from "src/auth/password.service";
import { ApiResponse, UserData, UserErrors } from "@repo/types";

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
  ) {}

  async getUser(userId: number): Promise<ApiResponse<UserData>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(UserErrors.USER_NOT_FOUND);
    }

    return {
      success: true,
      data: toUserSafe(user),
    };
  }

  async updateName(
    userId: number,
    newName: string,
  ): Promise<ApiResponse<UserData>> {
    console.log(userId, newName);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrors.USER_NOT_FOUND);
    }
    if (user.name === newName) {
      throw new BadRequestException(UserErrors.NAME_UNCHANGED);
    }
    const updatedUser = await this.userRepository.updateName(userId, newName);
    return {
      success: true,
      data: toUserSafe(updatedUser),
    };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrors.USER_NOT_FOUND);
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(UserErrors.INCORRECT_PASSWORD);
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(UserErrors.SAME_PASSWORD);
    }

    const newPasswordHash =
      await this.passwordService.hashPassword(newPassword);
    await this.userRepository.updatePassword(userId, newPasswordHash);

    return {
      success: true,
      message: "Password changed successfully",
    };
  }

  async deleteAccount(userId: number, password: string): Promise<ApiResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrors.USER_NOT_FOUND);
    }
    if (user.deletedAt) {
      throw new BadRequestException(UserErrors.ACCOUNT_ALREADY_DELETED);
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(UserErrors.INCORRECT_PASSWORD);
    }

    await this.userRepository.softDelete(userId);
    return { success: true, message: "Account deleted successfully" };
  }
}
