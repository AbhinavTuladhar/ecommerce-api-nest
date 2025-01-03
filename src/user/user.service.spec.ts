import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from 'src/entities/user.entity';
import * as argonUtils from 'src/utils/argon.utils';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  const repositoryToken = getRepositoryToken(User);

  const mockUserRepo = {
    delete: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: repositoryToken,
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(repositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('should encode the password correctly', async () => {
    //Arrange
    jest.spyOn(argonUtils, 'hashPassword').mockResolvedValue('hashedPassword');

    // Act
    await service.register({
      email: 'pCz0H@example.com',
      password: 'password',
      userName: 'username',
      role: UserRole.CUSTOMER,
    });

    // Assert
    expect(argonUtils.hashPassword).toHaveBeenCalledWith('password');
  });

  describe('user creation', () => {
    it('should call the user repo.create with correct params', async () => {
      await service.register({
        email: 'pCz0H@example.com',
        password: 'password',
        userName: 'username',
        role: UserRole.CUSTOMER,
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        userName: 'username',
        email: 'pCz0H@example.com',
        password: 'hashedPassword',
        role: UserRole.CUSTOMER,
      });
    });

    it('should create a new user and save to the database', async () => {
      // Arrange
      jest.spyOn(userRepository, 'create').mockReturnValue({
        id: '1',
        email: 'pCz0H@example.com',
        userName: 'username',
        role: UserRole.CUSTOMER,
        password: 'hashedPassword',
        orders: [],
      });

      await service.register({
        email: 'pCz0H@example.com',
        password: 'password',
        userName: 'username',
        role: UserRole.CUSTOMER,
      });
      // Assert
      expect(userRepository.save).toHaveBeenCalledWith({
        id: '1',
        email: 'pCz0H@example.com',
        userName: 'username',
        role: UserRole.CUSTOMER,
        password: 'hashedPassword',
        orders: [],
      });
    });
  });

  describe('fetching users', () => {
    it('should fetch a list of all the users', async () => {
      // Arrange
      const userList: User[] = [
        {
          email: 'pCz0H@example.com',
          userName: 'username',
          role: UserRole.CUSTOMER,
          password: 'hashedPassword',
          id: '1',
          orders: [],
        },
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValue(userList);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(userList);
    });

    it('should return a user on the basis of id', async () => {
      // Arrange
      const userId = '1';

      const user: User = {
        id: userId,
        email: 'pCz0H@example.com',
        userName: 'username',
        role: UserRole.CUSTOMER,
        password: 'hashedPassword',
        orders: [],
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: userId,
      });
    });
  });
});
