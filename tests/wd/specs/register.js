describe('Register', function() {
    var client;

    before(function(done) {
        client = newClient();
        client
            .setStory('Register')
            .startServer()
            .browse('/register')
            .call(done);
    });

    after(function (done) {
        client
            .stopServer()
            .end(done);
    });

    it('Title should be "Register"', function(done) {
        client
            .assertTitle('Sample App - Register')
            .call(done);
    });

    describe('Registration form', function() {

        it('should have all fields', function(done) {
            client
                .assertFieldExists('username')
                .assertFieldExists('password')
                .assertFieldExists('password_repeat')
                .assertFieldExists('email')
                .call(done);
        });

        it('should display error when values are required', function(done) {
            client
                .registerUser({})
                .screenstory('invalid: required form')
                .assertFieldError('username', 'username field is required')
                .assertFieldError('password', 'password field is required')
                .assertFieldError('email', 'email field is required')
                .call(done);
        });

        it('should display error when values are invalid', function(done) {
            client
                .registerUser({
                        username: 'foo',
                        password: 'bar',
                        password_repeat: 'baz',
                        email: 'foo@bar.ext'
                    })
                .screenstory('invalid: password form')
                .assertFormError('Passwords does not match.')
                .call(done);
        });
    });

    describe('New user', function() {
        it('should see success message', function(done) {
            client
                .registerUser({
                        username: 'foo',
                        password: 'bar',
                        password_repeat: 'bar',
                        email: 'foo@bar.ext'
                    })
                .call(done);
        });

        it('should be redirected to login', function(done) {
            client
                .screenstory('valid: login form')
                .assertPathname('/login', 'should redirect to login')
                .assertGlobalSuccess('Your account has been created')
                .call(done);
        });

        it('should be able to connect', function(done) {
            client
                .logIn({
                        username: 'foo',
                        password: 'bar'
                    })
                .screenstory('valid: user dashboard')
                .assertPathname('/app', 'should be logged in')
                .call(done);
        });
    });
});
