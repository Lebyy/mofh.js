const got = require('got');
const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser();
const {
    createAccountOptions,
    createAccountResponse,
    suspendAccountOptions,
    suspendAccountResponse,
    unsuspendAccountOptions,
    unsuspendAccountResponse,
    changePasswordOptions,
    changePasswordResponse,
    checkDomainAvailabilityResponse,
    getUserDomainsResponse,
    getUserByDomainResponse
} = require('./Constants');
class Client {
    constructor(options) {
        if (!options.username) {
            throw new Error(`username is a required option. (val=${options.username})`);
        }

        if (!options.password) {
            throw new Error(`password is a required option. (val=${options.password})`);
        }

        this.username = options.username;
        this.password = options.password;

        this.baseUrl = options.baseUrl || 'https://panel.myownfreehost.net/xml-api';
    }
    
    /**
     *
     * This method will create a new free hosting account with the provided information.
     * @param {createAccountOptions} options The options required to create an account.
     * @returns {Promise<createAccountResponse>} The response from the create account request.
     *
     * @example
     * client.createAccount({
     *  username: 'username', // The username of the account to create. (This username should be used when using the changePassword method, since the returned username is the vpanel username.)
     *  password: 'password', // The password of the user to create.
     *  contactemail: 'user@example.com', // The email address of the user to create.
     *  domain: 'yourdomain.tld', // If you want to use a domain which is not a subdomain, put that domain in.
     *  plan: 'plan' // The name of the plan from your mofh panel.
     * });
     */
    createAccount(
        options = {
            username: null,
            password: null,
            contactemail: null,
            domain: null,
            plan: null
        }
    ) {
        return new Promise((resolve, reject) => {
            if (!options.username) {
                reject(new Error('username is a required option.'));
            }
            if (!options.password) {
                reject(new Error('password is a required option.'));
            }
            if (!options.contactemail) {
                reject(new Error('Contact email is a required option.'));
            }
            if (!options.domain) {
                reject(new Error('Domain is a required option.'));
            }
            if (!options.plan) {
                reject(new Error('Plan is a required option.'));
            }

            got.post(this.baseUrl + `/createacct.php?${new URLSearchParams(options).toString()}`, {
                username: this.username,
                password: this.password
            })
                .then((response) => {
                    let parsedResponse = parser.parse(response.body);
                    if (!parsedResponse.createacct) {
                        reject(response.body);
                    }

                    parsedResponse = parsedResponse.createacct.result;

                    if (parsedResponse.status !== 1) {
                        reject({
                            ...parsedResponse,
                            rawResponse: response.body
                        });
                    }

                    resolve({
                        ...parsedResponse,
                        rawResponse: response.body
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    suspendAccount(
        options = {
            username: null,
            reason: null
        }
    ) {
        return new Promise((resolve, reject) => {
            if (!options.username) {
                reject(new Error('username is a required option.'));
            }
            if (!options.reason) {
                reject(new Error('reason is a required option.'));
            }

            got.post(this.baseUrl + `/suspendacct.php?${new URLSearchParams(options).toString()}`, {
                username: this.username,
                password: this.password
            })
                .then((response) => {
                    let parsedResponse = parser.parse(response.body);
                    if (!parsedResponse.suspendacct) {
                        reject(response.body);
                    }

                    parsedResponse = parsedResponse.suspendacct.result;

                    if (parsedResponse.status !== 1) {
                        reject({
                            ...parsedResponse,
                            rawResponse: response.body
                        });
                    }

                    resolve({
                        ...parsedResponse,
                        rawResponse: response.body
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    unsuspendAccount(
        options = {
            username: null,
            password: null
        }
    ) {
        return new Promise((resolve, reject) => {
            if (!options.username) {
                reject(new Error('username is a required option.'));
            }
            if (!options.password) {
                reject(new Error('password is a required option.'));
            }

            got.post(this.baseUrl + `/unsuspendacct.php?${new URLSearchParams(options).toString()}`, {
                username: this.username,
                password: this.password
            })
                .then((response) => {
                    let parsedResponse = parser.parse(response.body);
                    if (!parsedResponse.unsuspendacct) {
                        reject(response.body);
                    }

                    parsedResponse = parsedResponse.unsuspendacct.result;

                    if (parsedResponse.status !== 1) {
                        reject({
                            ...parsedResponse,
                            rawResponse: response.body
                        });
                    }

                    resolve({
                        ...parsedResponse,
                        rawResponse: response.body
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    changePassword(
        options = {
            user: null,
            pass: null
        }
    ) {
        return new Promise((resolve, reject) => {
            if (!options.user) {
                reject(new Error('user is a required option.'));
            }
            if (!options.pass) {
                reject(new Error('pass is a required option.'));
            }

            got.post(this.baseUrl + `/passwd.php?${new URLSearchParams(options).toString()}`, {
                username: this.username,
                password: this.password
            })
                .then((response) => {
                    let parsedResponse = parser.parse(response.body);
                    if (!parsedResponse.passwd.passwd) {
                        reject(response.body);
                    }

                    parsedResponse = parsedResponse.passwd.passwd;

                    if (parsedResponse.status !== 1) {
                        reject({
                            ...parsedResponse,
                            rawResponse: response.body
                        });
                    }

                    resolve({
                        ...parsedResponse,
                        rawResponse: response.body
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    checkDomainAvailability(domain) {
        return new Promise((resolve, reject) => {
            got.post(
                this.baseUrl +
                    `/checkavailable.php?api_user=${this.username}&api_key=${this.password}&domain=${domain}`,
                {
                    username: this.username,
                    password: this.password
                }
            )
                .then((response) => {
                    if (response.body !== '1' && response.body !== '0') {
                        reject(response.body);
                    } else {
                        resolve({
                            isAvailable: response.body === '1',
                            domain: domain,
                            rawResponse: response.body
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getUserDomains(username) {
        return new Promise((resolve, reject) => {
            got.post(
                this.baseUrl +
                    `/getuserdomains.php?api_user=${this.username}&api_key=${this.password}&username=${username}`,
                {
                    username: this.username,
                    password: this.password
                }
            )
                .then((response) => {
                    if (response.body === '') {
                        resolve({
                            domains: [],
                            username: username,
                            rawResponse: response.body
                        });
                    }

                    if (response.body === 'null') {
                        resolve({
                            domains: [],
                            username: username,
                            rawResponse: response.body
                        });
                    }

                    if (response.body[0] !== '[') {
                        reject(response.body);
                    }

                    const domains = JSON.parse(response.body);
                    resolve({
                        domains: domains.map((domain) => {
                            return {
                                status: domain[0],
                                domain: domain[1]
                            };
                        }),
                        username: username,
                        rawResponse: response.body
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getUserByDomain(domain) {
        return new Promise((resolve, reject) => {
            got.post(
                this.baseUrl + `/getdomainuser.php?api_user=${this.username}&api_key=${this.password}&domain=${domain}`,
                {
                    username: this.username,
                    password: this.password
                }
            )
                .then((response) => {
                    if (response.body === '') {
                        resolve({
                            status: null,
                            domain: domain,
                            path: null,
                            username: null,
                            rawResponse: response.body
                        });
                    }

                    if (response.body === 'null') {
                        resolve({
                            status: null,
                            domain: domain,
                            path: null,
                            username: null,
                            rawResponse: response.body
                        });
                    }

                    if (response.body[0] !== '[') {
                        reject(response.body);
                    }

                    const parsedResponse = JSON.parse(response.body);

                    resolve({
                        status: parsedResponse[0],
                        domain: parsedResponse[1],
                        path: parsedResponse[2],
                        username: parsedResponse[3],
                        rawResponse: response.body
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

module.exports = Client;
