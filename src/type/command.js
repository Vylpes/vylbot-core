class command {
    constructor(run) {
        this.run = run;

        this._roles = [];
        this._configs = [];
        this._users = [];
    }

    // Description
    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }

    // Category
    get category() {
        return this._category;
    }

    set category(category) {
        this._category = category;
    }

    // Usage
    get usage() {
        return this._usage;
    }

    set usage(usage) {
        this._usage = usage;
    }

    // Roles
    get roles() {
        return this._roles;
    }

    set roles(role) {
        this._roles.push(role);
    }

    // Config
    get configs() {
        return this._configs;
    }

    set configs(conf) {
        this._configs.push(conf);
    }

    get requiredConfigs() {
        console.warn("'requiredConfigs' is deprecated and will be removed in a future version. Please use 'configs' instead.");
        return this._configs;
    }

    set requiredConfigs(conf) {
        console.warn("'requiredConfigs' is deprecated and will be removed in a future version. Please use 'configs' instead.");
        this._configs.push(conf);
    }

    // Users
    get users() {
        return this._users;
    }

    set users(userid) {
        this._users.push(userid);
    }
}

module.exports = command;
