import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from "jquery";
import { User, UserPassword } from 'src/app/models/web';
import { AppGlobalService } from 'src/app/services/globals.service';
@Component({
  selector: 'signup-page',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupPageComponent implements OnInit {
    PageTitle = 'Sign Up!';

    loading: boolean = false;
    txtUsername: string = '';
    txtPassword: string = '';
    txtEmail: string = '';
    formGroup: any;
    isStateSignup = true;

    constructor(private globals: AppGlobalService, private router: Router)  {

    }

    ngOnInit()  {
        console.log("signup page")
        this.attachCssEventHandler();
    }

    onToggleChange(params: any)  {
        this.isStateSignup = params;
        this.toggleEmailInput(!params);
        if (params)  {
            this.PageTitle = 'Sign Up!';
        } else {
            this.PageTitle = 'Sign In!';
        }
    }

    async onSubmit(params: any)  {
        this.loading = true;
        const error = false;
        const vEmail = this.validateEmail(this.txtEmail);
        const sUsername = this.sanitizeInput(true, this.txtUsername);
        const sPassword = this.sanitizeInput(false, this.txtPassword);
        const allow = (vEmail && sUsername && sPassword) || (sUsername && sPassword && !vEmail);
        let success
        if (allow)  {
            const e = vEmail ? vEmail : '';
            const u = new User(sUsername, e);
            const up = new UserPassword(0, sPassword);
            success = await this.globals.LoginOrRegister(u, up);
        }
        if (!success)  {
            console.log("Error - User not signed in");
        } else {
            this.router.navigate(['/home']);
        }
        Promise.resolve();
    }

    validateEmail(email: string): string | false  {
        return email;
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

    private toggleEmailInput(show = false)  {
        const elem = document.getElementById('emailInput');
        const value = show ? '0' : '1';
        if (elem)  {
            elem.style.opacity = value;
        }
    }
}
