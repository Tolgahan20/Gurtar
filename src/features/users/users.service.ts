import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        ...(createUserDto.phone ? [{ phone: createUserDto.phone }] : []),
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or phone already exists',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(
    paginationDto: PaginationDto,
    filterDto: UserFilterDto,
  ): Promise<PaginatedResponseDto<User>> {
    const { page, limit, sortBy, sortOrder, skip } = paginationDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Apply filters
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.surname ILIKE :search OR user.email ILIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (filterDto.login_type) {
      queryBuilder.andWhere('user.login_type = :login_type', {
        login_type: filterDto.login_type,
      });
    }

    if (filterDto.gender) {
      queryBuilder.andWhere('user.gender = :gender', {
        gender: filterDto.gender,
      });
    }

    if (filterDto.email) {
      queryBuilder.andWhere('user.email ILIKE :email', {
        email: `%${filterDto.email}%`,
      });
    }

    if (filterDto.phone) {
      queryBuilder.andWhere('user.phone ILIKE :phone', {
        phone: `%${filterDto.phone}%`,
      });
    }

    // Apply sorting
    if (sortBy) {
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('user.createdAt', sortOrder);
    }

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    // Select only necessary fields
    queryBuilder.select([
      'user.id',
      'user.name',
      'user.surname',
      'user.email',
      'user.phone',
      'user.login_type',
      'user.gender',
      'user.birthday',
      'user.allergies',
      'user.createdAt',
      'user.updatedAt',
    ]);

    const [users, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(users, total, page || 1, limit || 10);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'surname',
        'email',
        'phone',
        'login_type',
        'gender',
        'birthday',
        'allergies',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.findOne(id);

    // Hash password if it's being updated
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      delete updateUserDto.password;
      Object.assign(user, { password_hash: hashedPassword });
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }
}
