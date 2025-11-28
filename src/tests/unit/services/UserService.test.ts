import { UserService } from "../../../services/UserService";
import { CreateUserDTO } from "../../../models/User";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("createUser", () => {
    it("should create a new user with valid data", async () => {
      const userData: CreateUserDTO = {
        name: "John Doe",
        email: "john@example.com",
        role: "user",
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.isActive).toBe(true);
    });

    it("should throw error for invalid email", async () => {
      const userData: CreateUserDTO = {
        name: "John Doe",
        email: "invalid-email",
        role: "user",
      };

      await expect(userService.createUser(userData)).rejects.toThrow(
        "Invalid email format"
      );
    });

    it("should throw error for empty name", async () => {
      const userData: CreateUserDTO = {
        name: "   ",
        email: "john@example.com",
        role: "user",
      };

      await expect(userService.createUser(userData)).rejects.toThrow(
        "Name cannot be empty"
      );
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = await userService.getAllUsers();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe("getUserById", () => {
    it("should return user if found", async () => {
      const userData: CreateUserDTO = {
        name: "Jane Doe",
        email: "jane@example.com",
      };

      const createdUser = await userService.createUser(userData);
      const foundUser = await userService.getUserById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
    });

    it("should return null if user not found", async () => {
      const user = await userService.getUserById("non-existent-id");
      expect(user).toBeNull();
    });
  });
});
