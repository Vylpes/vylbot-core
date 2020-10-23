class command {
    constructor(run) {
        this.run = run;

        this._roles = [];
        this._requiredConfigs = [];
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
}

module.exports = command;
