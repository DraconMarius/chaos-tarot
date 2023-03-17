// import decode so we can decode the token and get the user's data out of it
import decode from "jwt-decode";
//  The Auth class is a utility class that will be used to manage the user's authentication state.
class Auth {
    getProfile() {
        return decode(this.getToken());
    }

    loggedIn() {
        const token = this.getToken();
        // If there is a token and it's not expired, return `true`
        return token && !this.isTokenExpired(token) ? true : false;
    }

    isTokenExpired(token) {
        // Decode the token to get its expiration time that was set by the server
        // We also need to apply the jwt library's decode() method to our token.
        // It looks like the expiration time, as set by the server, is being retrieved and stored in a variable decoded:
        const decoded = decode(token);
        // If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
        // Next, we look at the code used to compare the expiration date to the current time. For the comparison to work, the time units we use must be the same.
        // Because decoded.exp is in seconds and the Date.now() method returns a value in milliseconds, we divide the value that Date.now() returns by 1000.
        // Then a valid comparison can be made:
        if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem("id_token");
            return true;
        }
        // If token hasn't passed its expiration time, return `false`
        return false;
    }
    // The getToken() method retrieves the token from localStorage and returns it.
    getToken() {
        return localStorage.getItem("id_token");
    }
    // The login() method takes a token as an argument and stores it in localStorage and redirects the user to the home page.
    login(idToken) {
        localStorage.setItem("id_token", idToken);
        window.location.assign("/");
    }
    // The logout() method removes the token from localStorage and reloads the page.
    logout() {
        localStorage.removeItem("id_token");
        window.location.replace("/");
    }
}

export default new Auth();
