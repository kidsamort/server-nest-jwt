import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Token } from 'src/auth/token/token.model';

interface UserCreationAttrs {
	name: string;
	email: string;
	password: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttrs> {
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id: number;

	@Column({ type: DataType.STRING, allowNull: false })
	name: string;

	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	email: string;

	@Column({ type: DataType.STRING, allowNull: false })
	password: string;

	@HasMany(() => Token)
	tokens: Token[];
}
