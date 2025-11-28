import { Request, Response } from "express";
import { userService } from "../services/UserService";
import { CreateUserDTO, UpdateUserDTO } from "../models/User";
import { ApiResponse } from "../models/Common";
import { logger } from "../utils/logger";

export class UserController {
  /**
   * Creates a new user
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      const user = await userService.createUser(userData);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: "User created successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error("Error creating user", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  }

  /**
   * Gets all users
   */
  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      const response: ApiResponse = {
        success: true,
        data: users,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching users", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }

  /**
   * Gets a user by ID
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: "User not found",
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching user", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }

  /**
   * Updates a user
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateUserDTO = req.body;
      const user = await userService.updateUser(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: "User updated successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error updating user", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  }

  /**
   * Deletes a user
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        message: "User deleted successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error deleting user", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  }
}

export const userController = new UserController();
