
class SpotifyPlayer {
    constructor(options = {}) {
        this.options = options;
        this.listeners = {};
        this.accessToken = localStorage.getItem("Spotify token");
        this.exchangeHost = options.exchangeHost || "https://spotify-player.herokuapp.com";
        this.obtainingToken = false;
        this.loopInterval = null;
        this.expiresIn = 0;
        const player = new SpotifyPlayer();
        player.init();
    }

    on(eventType, callback) {
        this.listeners[eventType] = this.listeners[eventType] || [];
        this.listeners[eventType].push(callback);
    }

    dispatch(topic, data) {
        const listeners = this.listeners[topic];
        if (listeners) {
            listeners.forEach((listener) => {
                listener.call(null, data);
            });
        }
    }

    async init() {
        await this.fetchToken()
            .then((r) => r.json())
            .then((json) => {
                this.accessToken = json["access_token"];
                this.expiresIn = json["expires_in"];
                this._onNewAccessToken();
            });
    }

    async fetchToken() {
        this.obtainingToken = true;
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken === null) {
                throw new Error("No se encontró refreshToken en localStorage");
            }
            const response = await fetch(`${this.exchangeHost}/token`, {
                method: "POST",
                body: JSON.stringify({ refresh_token: refreshToken }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });
            this.obtainingToken = false;
            return response;
        } catch (e) {
            console.error(e);
        }
    }

    _onNewAccessToken() {
        if (this.accessToken === "") {
            console.log("Got empty access token, log out");
            this.dispatch("login", null);
            this.logout();
        } else {
            const loop = async () => {
                if (!this.obtainingToken) {
                    try {
                        const data = await this.fetchPlayer();
                        if (data !== null && data.item !== null) {
                            this.dispatch("update", data);
                        }
                    } catch (e) {
                        console.log("Logging user out due to error", e);
                        this.logout();
                    }
                }
            };
            this.fetchUser().then((user) => {
                this.dispatch("login", user);
                this.loopInterval = setInterval(loop.bind(this), 1500);
                loop();
            });
        }
    }

    logout() {
        // clear loop interval
        if (this.loopInterval !== null) {
            clearInterval(this.loopInterval);
            this.loopInterval = null;
        }
        this.accessToken = null;
        this.dispatch("login", null);
    }

    login() {
        return new Promise((resolve, reject) => {
            const getLoginURL = (scopes) => {
                return `${this.exchangeHost}/login?scope=${encodeURIComponent(
                    scopes.join(" ")
                )}`;
            };

            const url = getLoginURL(["user-read-playback-state"]);

            const width = 400;
            const height = 600;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            window.addEventListener(
                "message",
                (event) => {
                    const hash = JSON.parse(event.data);
                    if (hash.type === "access_token") {
                        this.accessToken = hash.access_token;
                        this.expiresIn = hash.expires_in;
                        this._onNewAccessToken();
                        if (this.accessToken === "") {
                            reject();
                        }
                    } else {
                        const refreshToken = hash.refresh_token;
                        localStorage.setItem('refreshToken', refreshToken);
                        resolve(hash.access_token);
                    }
                },
                false
            );

            const w = window.open(
                url,
                'Spotify',
                'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' +
                width +
                ',height=' +
                height +
                ',top=' +
                top +
                ',left=' +
                left
            );
        });
    }
    async fetchPlayer() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player', {
                headers: new Headers({
                    Authorization: `Bearer ${this.accessToken}`
                })
            });

            if (response.status === 401) {
                await this.fetchToken().then(r => r.json()).then(json => {
                    this.accessToken = json['access_token'];
                    this.expiresIn = json['expires_in'];
                });
                return null;
            }

            if (response.status === 200) {
                const json = await response.json();
                return json;
            }
            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async fetchUser() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: new Headers({
                    Authorization: `Bearer ${this.accessToken}`
                })
            });
            const json = await response.json();
            return json;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    
}
export default SpotifyPlayer;