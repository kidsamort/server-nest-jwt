import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/user.model';

interface TokenCreationAttrs {
	userId: number;
	refreshToken: string;
	accessToken: string;
}

@Table({ tableName: 'token' })
export class Token extends Model<Token, TokenCreationAttrs> {
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER })
	userId: number;

	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	refreshToken: string;

	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	accessToken: string;

	@BelongsTo(() => User)
	owner: User;
}
