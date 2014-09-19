describe('Password', function() {
    var client;

    before(function(done) {
        client = newClient();
        client
            .setStory('Password')
            .startServer()
            .browse('/login')
            .logIn({
                    username: 'julien',
                    password: 'pwd'
                })
            .waitFor('[href="/me/password"]')
            .click('[href="/me/password"]')
            .call(done);
    });

    after(function (done) {
        client
            .stopServer()
            .end(done);
    });

    it('should display password protection', function(done) {
        client
            .waitFor('input[name=password]')
            .screenstory('require sudo screen')
            .call(done);
    });

    it('should not accept wrong password', function(done) {
        client
            .fillSudo('foo')
            .assertFormError('Password does not match.')
            .call(done);
    });

    it('should display wrong password errors', function(done) {
        client
            .screenstory('require sudo (bad password error)')
            .call(done);
    });

    it('should not accept empty password', function(done) {
        client
            .fillSudo('')
            .assertFormError('Password does not match.')
            .call(done);
    });

    it('should display wrong password errors', function(done) {
        client
            .screenstory('require sudo (empty password error)')
            .call(done);
    });

    it('should accept correct password', function(done) {
        client
            .fillSudo('pwd')
            .assertGlobalSuccess('Your password has been successfuly checked.')
            .screenstory('change password with sudo success message')
            .assertFieldExists('password')
            .assertFieldExists('password_repeat')
            .call(done);
    });

    it('should keep the sudo right when leaving page', function(done) {
        client
            .click('[href="/me"]')
            .click('[href="/me/password"]')
            .screenstory('sudo protected with already set credentials')
            .assertFieldExists('password')
            .assertFieldExists('password_repeat')
            .call(done);
    });

    it('should check provided passwords are equals', function(done) {
        client
            .updatePassword('foo', 'bar')
            .assertFormError('Passwords does not match.')
            .screenstory('change password mismatch')
            .call(done);
    });

    it('should reject empty password', function(done) {
        client
            .updatePassword('', '')
            .screenstory('change password required')
            .assertFieldError('password', 'password field is required')
            .call(done);
    });

    it('should accept user actual password', function(done) {
        client
            .updatePassword('aaa', 'aaa')
            .screenstory('change password success')
            .assertGlobalSuccess('Your password has been updated')
            .call(done);
    });

    it('should reset sudo after password update', function(done) {
        client
            .click('a[href="/me/password"]')
            .waitFor('input[name=password]')
            .screenstory('require sudo screen after password update')
            .call(done);
    });

    it('should accept new password for login', function(done) {
        client
            .logOut()
            .click('a[href="/login"]')
            .logIn({
                username: 'julien',
                password: 'aaa'
            })
            .assertPathname('/app', 'should be logged in')
            .call(done);
    });
});
