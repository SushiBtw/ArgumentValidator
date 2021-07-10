import { User, Snowflake, Message, GuildMember } from 'discord.js';
export const ArgParseErrors: { [key: string]: string; } = {
    'InvalidNumber': 'The provided number was invalid',
    'InvalidString': 'The provided string was invalid',
    'InvalidSnowflake': 'The provided snowflake was invalid',
    'TooSmall': 'The provided number/string length was too small',
    'TooBig': 'The provided number/string length was too big',
    'InvalidArgsSize': 'The provided arguments length is not valid',
    'InvalidEmail': 'The provided string was not an email',
    'InvalidRegex': 'The provided string was not an provided regex',
    'UnknownUser': 'The provided argument was not a user'
}
export class ArgParseError {
    public options?: ArgParseInterface;
    key: string;
    msg: string;

    constructor(options: ArgParseInterface) {
        this.key = options.key;
        this.msg = ArgParseErrors[options.key] ?? options.key;

        for (const [K, V] of Object.entries(options)) {
            // @ts-ignore
            this[K] = V;
        }
    }
}
export const RegexList = {
    userOrMember: new RegExp("^(?:<@!?)?(\\d{17,21})>?$"),
    channel: new RegExp("^(?:<#)?(\\d{17,21})>?$"),
    role: new RegExp("^(?:<@&)?(\\d{17,21})>?$"),
    snowflake: new RegExp("^(\\d{17,21})$"),
    email: new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
};
export interface ArgParseInterface {
    key: string;
    arg?: number;
    expected?: any;
    got?: any;
    minimum?: number;
    maximum?: number;
}
export interface Arg<N extends string, T> {
    parse(v: any, message?: Message): T;
    remaining(r?: boolean): this;
    _remaining: boolean;
    _id: number;
}

export interface StringArg<N extends string> extends Arg<N, string> {
    min(n: number): this;
    max(n: number): this;
    email(): this;
    regex(r: RegExp): this;
}
export interface IntArg<N extends string> extends Arg<N, number> {
    min(n: number): this;
    max(n: number): this;
}
export interface SnowflakeArg<N extends string> extends Arg<N, string> {

}
export interface AnyArg<N extends string> extends Arg<N, string> {

}
export interface UserArg<N extends string> extends Arg<N, User|Snowflake> {

}
export interface MemberArg<N extends string> extends Arg<N, GuildMember|Snowflake> {

}

export type GetType<T extends unknown[]> =
    T extends [Arg<infer N, infer T>]
        ? { [id in N]: T }
        : T extends [Arg<infer N, infer T>, ...(infer R)]
        ? { [id in N]: T } & GetType<R>
        : never;
