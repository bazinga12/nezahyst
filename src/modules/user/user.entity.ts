import { ChildEntity, OneToMany } from "typeorm";
import { BaseUser } from "./base-user.entity";
import { Verification } from "./verification.entity";

@ChildEntity()
export class User extends BaseUser {
    @OneToMany(() => Verification, (verification) => verification.user)
    verifications: Verification[];
}