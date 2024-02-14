import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
@Injectable()
export class UsersService {
	// repo: Repository<User>
	constructor(@InjectRepository(User) private repo: Repository<User>) {}

	// this.repo = repo
	create(email: string, password: string) {
		const user = this.repo.create({ email, password })

		return this.repo.save(user)
	}

	findOne(id: number) {
		return this.repo.findOneBy({ id })
	}

	find(email: string) {
    return this.repo.find({ where: { email } });
  }

	async update(id: number, attrs: Partial<User>) {
		// Partial is type helper from Typescript.
		// controls what data is incoming  if type is different, you'll get an error
		const user = await this.findOne(id)
		if (!user) {
			throw new Error('User not found')
		}
		Object.assign(user, attrs)
		return this.repo.save(user)
	}

	async remove(id: number) {
		const user = await this.findOne(id)
		if (!user) {
			throw new Error('User not found')
		}
		return this.repo.remove(user)
		// will remove user entity
	}
	// remove is used with Entities
	// delete is used with data
	// If use delete, hooks won't be implemented
}
