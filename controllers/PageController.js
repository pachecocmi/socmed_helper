export class PageController {

    async dashboard(request, reply) {
        console.log(request.session);

        return {
            message: "Hello World",
            page: "Dashboard",
            description: "Central command for your messenger pods and page groups."
        };
    }

    async login(request, reply) {
        request.session = {
            userId: 12345,
            username: "testuser",
            role: "admin"
        };
        // console.log(request.session);
        // if(request.session) {
        //     return reply.redirect('/dashboard');
        // }
        return {
            message: "Hello World",
            page: "Login Gateway"
        };
    }

    async userAccount(request, reply) {
        return {
            message: "Hello World",
            page: "User Account Settings"
        };
    }

}