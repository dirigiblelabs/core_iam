/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO IAM_USERS (USER_ID,USER_USERNAME,USER_PASSWORD,USER_CREATED_AT,USER_CREATED_BY) VALUES (?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('IAM_USERS_USER_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.user_username);
        statement.setString(++i, entity.user_password);
        if (entity.user_created_at !== null) {
            var js_date_user_created_at =  new Date(Date.parse(entity.user_created_at));
            statement.setTimestamp(++i, js_date_user_created_at);
        } else {
            statement.setTimestamp(++i, null);
        }
        statement.setString(++i, entity.user_created_by);
        statement.executeUpdate();
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM IAM_USERS WHERE USER_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM IAM_USERS';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE IAM_USERS SET USER_USERNAME = ?,USER_PASSWORD = ?,USER_CREATED_AT = ?,USER_CREATED_BY = ? WHERE USER_ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.user_username);
        statement.setString(++i, entity.user_password);
        if (entity.user_created_at !== null) {
            var js_date_user_created_at =  new Date(Date.parse(entity.user_created_at));
            statement.setTimestamp(++i, js_date_user_created_at);
        } else {
            statement.setTimestamp(++i, null);
        }
        statement.setString(++i, entity.user_created_by);
        var id = entity.user_id;
        statement.setInt(++i, id);
        statement.executeUpdate();
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM IAM_USERS WHERE USER_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.user_id);
        statement.executeUpdate();
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM IAM_USERS';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'iam_users',
		type: 'object',
		properties: [
		{
			name: 'user_id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'user_username',
			type: 'string'
		},
		{
			name: 'user_password',
			type: 'string'
		},
		{
			name: 'user_created_at',
			type: 'timestamp'
		},
		{
			name: 'user_created_by',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.user_id = resultSet.getInt('USER_ID');
    result.user_username = resultSet.getString('USER_USERNAME');
    result.user_password = resultSet.getString('USER_PASSWORD');
    if (resultSet.getTimestamp('USER_CREATED_AT') !== null) {
        result.user_created_at = new Date(resultSet.getTimestamp('USER_CREATED_AT').getTime());
    } else {
        result.user_created_at = null;
    }
    result.user_created_by = resultSet.getString('USER_CREATED_BY');
    return result;
}
