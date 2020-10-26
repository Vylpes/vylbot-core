class command {
    constructor(run) {
        this.run = run;

        this._roles = [];
        this._requiredConfigs = [];
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
    get requiredConfigs() {
        return this._requiredConfigs;
    }

    set requiredConfigs(conf) {
        this._requiredConfigs.push(conf);
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
