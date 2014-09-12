describe('Profile', function() {
    var client;

    before(function(done) {
        client = newClient();
        client
            .setStory('Profile')
            .startServer()
            .browse('/login')
            .logIn({
                    username: 'julien',
                    password: 'pwd'
                })
            .call(done);
    });

    after(function (done) {
        client
            .stopServer()
            .end(done);
    });

    describe('test', function() {
        it('should start with a user logged in', function(done) {
            client
                .assertTitle('Sample App - Dashboard')
                .assertText('.current-user', 'julien')
                .call(done);
        });
    });

    describe('view page', function() {
        it('should be accessible through a link', function(done) {
            client
                .assertExists('a[href="/me"]')
                .click('a[href="/me"]')
                .call(done);
        });
        it('should take a screenshot', function(done) {
            client
                .screenstory('user profile show')
                .call(done);
        });
        it('should display user informations', function(done) {
            client
                .assertText('.profile-show-item.username', 'julien')
                .assertText('.profile-show-item.email', 'julien@example.com')
                .call(done);
        });
        it('should present a link to profile edition', function(done) {
            client
                .assertExists('#l-main a[href="/me/edit"]')
                .click('#l-main a[href="/me/edit"]')
                .call(done);
        });
    });

    describe('profile form', function() {

        it('should take a screenshot', function(done) {
            client
                .screenstory('user profile edit init')
                .call(done);
        });

        it('should have all fields', function(done) {
            client
                .assertFieldExists('email')
                .call(done);
        });

        it('should display error when values are required', function(done) {
            client
                .updateProfile({'email': ''})
                .assertFieldError('email', 'email field is required')
                .call(done);
        });

        it('should take a screenshot', function(done) {
            client
                .screenstory('user profile edit error')
                .call(done);
        });

        it('should see success message', function(done) {
            client
                .updateProfile({
                        email: 'foo@bar.ext'
                    })
                .call(done);
        });

        it('should take a screenshot', function(done) {
            client
                .screenstory('user profile edit success')
                .call(done);
        });

        it('should be redirected to his account page', function(done) {
            client
                .assertPathname('/me', 'should redirect to user account')
                .assertGlobalSuccess('Your profile has been updated')
                .call(done);
        });
    });
});
