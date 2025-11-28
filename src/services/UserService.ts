import { User, CreateUserDTO, UpdateUserDTO } from "../models/User";
import {
  isValidEmail,
  isNotEmpty,
  hasRequiredFields,
} from "../utils/validators";
import { logger } from "../utils/logger";

// Simulated in-memory database
let users: User[] = [];

export class UserService {
  /**
   * Creates a new user
   */
  async createUser(userData: CreateUserDTO): Promise<User> {
    logger.info("Creating new user", { email: userData.email });

    // Validation
    if (!hasRequiredFields(userData, ["name", "email"])) {
      throw new Error("Missing required fields: name and email");
    }

    if (!isValidEmail(userData.email)) {
      throw new Error("Invalid email format");
    }

    if (!isNotEmpty(userData.name)) {
      throw new Error("Name cannot be empty");
    }

    // Check if email already exists
    if (this.findUserByEmail(userData.email)) {
      throw new Error("Email already exists");
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    logger.info("User created successfully", { userId: newUser.id });
    return newUser;
  }

  /**
   * Retrieves all users
   */
  async getAllUsers(): Promise<User[]> {
    logger.debug("Fetching all users");
    return users;
  }

  /**
   * Retrieves a user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    logger.debug("Fetching user by ID", { userId: id });
    const user = users.find((u) => u.id === id);
    return user || null;
  }

  /**
   * Updates a user
   */
  async updateUser(id: string, updateData: UpdateUserDTO): Promise<User> {
    logger.info("Updating user", { userId: id });

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    if (updateData.email && !isValidEmail(updateData.email)) {
      throw new Error("Invalid email format");
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    users[userIndex] = updatedUser;
    logger.info("User updated successfully", { userId: id });
    return updatedUser;
  }

  /**
   * Deletes a user
   */
  async deleteUser(id: string): Promise<void> {
    logger.info("Deleting user", { userId: id });

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    users.splice(userIndex, 1);
    logger.info("User deleted successfully", { userId: id });
  }

  /**
   * Finds a user by email
   */
  private findUserByEmail(email: string): User | undefined {
    return users.find((u) => u.email === email);
  }

  /**
   * Gets active users count
   */
  async getActiveUsersCount(): Promise<number> {
    return users.filter((u) => u.isActive).length;
  }
}

export const userService = new UserService();
