import { ChildEntity } from "typeorm";
import { BaseUser } from "./base-user.entity";

@ChildEntity()
export class Admin extends BaseUser {

}