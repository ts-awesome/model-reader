import {dbField, dbTable} from '@viatsyshyn/ts-orm';

@dbTable('Computer', [{name: 'id', fields: ['id']}])
export class Computer {
    @dbField({
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @dbField({
        kind: 'uuid'
    })
    uid?: string;

    @dbField()
    name!: string;

    @dbField()
    year!: number;

    @dbField()
    price!: number;
}