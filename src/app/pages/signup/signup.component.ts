import { Component, OnInit } from '@angular/core';
import $ from "jquery";
import { User, UserPassword } from 'src/app/models/web';
import { AppGlobalService } from 'src/app/services/globals.service';
@Component({
  selector: 'signup-page',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupPageComponent implements OnInit {
    title = 'chess-angular';
    loading: boolean = false;
    txtUsername: string = '';
    txtPassword: string = '';
    txtEmail: string = '';
    formGroup: any;

    constructor(private globals: AppGlobalService)  {

    }

    ngOnInit()  {
        console.log("signup page")
        this.attachCssEventHandler();
    }

    async onSubmit(params: any)  {
        this.loading = true;
        const error = false;
        const vEmail = this.validateEmail(this.txtEmail);
        const sUsername = this.sanitizeInput(true, this.txtUsername);
        const sPassword = this.sanitizeInput(false, this.txtPassword);
        let idUserResponse
        if (vEmail && sUsername && sPassword)  {
            const u = new User(sUsername, vEmail);
            const up = new UserPassword(0, sPassword)
            idUserResponse = await this.globals.LoginOrRegister(u, up);
        }
        
    }

    validateEmail(email: string): string | false  {

        return false;
    }

    sanitizeInput(forUsername: boolean, text: string): string | false  {

        if (forUsername)  {
            const username = text;
            return username;
        } else  {
            const password = text;
            return password;
        }

        return false;
    }

    attachCssEventHandler()  {
        $(function() {
            $('input').on('change', function() {
            var input = $(this);
            if (!input.val()) {
                input.removeClass('populated');
            } else {
                input.addClass('populated');
            }
            });
            
            setTimeout(function() {
            $('#fname').trigger('focus');
            }, 500);
        });
    }
}
