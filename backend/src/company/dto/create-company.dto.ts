
import { IsEmail, IsString, IsInt, IsNotEmpty} from 'class-validator';

export class CreateCompanyDto{

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsEmail()
    email!: string;

    @IsInt()
     @IsNotEmpty()
    phone!: string;

    @IsInt()
     @IsNotEmpty()
    registrationNumber!: string;

    @IsString()
     @IsNotEmpty()
    address!: string;

    @IsString()
     @IsNotEmpty()
    city!: string;

    @IsString()
     @IsNotEmpty()
    state!: string;

    @IsString()
     @IsNotEmpty()
    country!: string;


}