import { Module } from "@nestjs/common";
import { CompanyController} from "./company-controller";
import { PrismaService } from "../database/prisma.service";
import { AuthService } from "../auth/auth.service";
import { CompanyService} from '../company/company.service';


@Module({
    imports:[ PrismaService, AuthService,],
    controllers: [ CompanyController],
    providers: [ CompanyService],
})
export class CompanyModule{}
