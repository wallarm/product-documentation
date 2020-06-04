[img-basic-auth]:       ../images/user-guides/sso/basic-auth.png
[img-sso-login-form]:   ../images/user-guides/sso/sso-login-form.png       
[img-idp-auth-pages]:   ../images/user-guides/sso/idp-auth-pages.png    
[img-wl-dashboard]:     ../images/user-guides/dashboard/dashboard-waf.png

[link-gsuite]:      https://gsuite.google.com/
[link-okta]:        https://www.okta.com/


#   Using single sign-on to Wallarm portal

This guide will cover the process of user authentication on the Wallarm portal using Single Sign‑On (SSO) technology.

!!! info "Prerequisites"
    If SSO authentication was enabled and your account role is not *Admin*, then you can now only use SSO authentication to log in to the Wallarm portal.
    
    This guide assumes that you already have an account with one of the identity providers, such as [Okta][link-okta] or [G Suite][link-gsuite]. If this is not the case, please contact your administrator.

To authenticate using SSO, go to the Wallarm login page.

If you use an address like `<some_domain>.wallarm.com` (e.g., `my.wallarm.com`) to log in to Wallarm, then you will need to click the *Sign in with SAML SSO* link to login with SSO (login/password pair is considered a priority).

![!The “login/password” pair login page][img-basic-auth]

If you use an address like `<company_domain>.wallarm.io` (the domain allocated to the company your account belongs to) to log in to Wallarm, then the priority login method is the SSO login, and the login form will be different from the one given above.

![!SSO login form][img-sso-login-form]

To log in to Wallarm using SSO, you need to enter your email.

If the entered email is registered and SSO authentication is configured for it, you will be redirected to an identity provider (IdP) service, such as Okta or G Suite. If you are also not authorized by this provider, you will be redirected to the login page. The login pages for the Okta and G Suite services are shown below.

![!Okta and G Suite login pages][img-idp-auth-pages]

Enter your email and password (additional options with two-factor authentication). After successful authentication by the identity provider and verification of access rights to the requested resource (Wallarm), the provider redirects you to the Wallarm portal. At the same time, the provider sends a request to the Wallarm side confirming that you are a legitimate user, as well as other necessary parameters. In this way, you will be logged in to the Wallarm portal and the dashboard page will be opened.

![!Wallarm portal's Dashboard][img-wl-dashboard]

This completes the SSO authentication process.