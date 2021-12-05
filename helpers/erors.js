const config = require('../config');
const {Neo4jError} = require('neo4j-driver-core/lib/error');
const AppError= require( './app-error');

let  errorHandler =  (error, req, res, next) => {
	const meta = {};
	if (error instanceof Neo4jError) {
		const code = 503;
		meta.status_code = code;
		meta.error = {
			code,
			message: 'Some setup problems with datastore, please try again'
		};
		meta.developer_message = error;
	} else if (error instanceof AppError) {
		const err = error.format();
		const code = err.code;
		meta.status_code = code;
		meta.error = {code, message: err.message};
		if (err.messages) {
			meta.error.messages = err.messages;
		}
		if (err.type) {
			meta.error.type = err.type;
		}
	} else if (error instanceof Error) {
		meta.status_code = error.status;
		meta.error = {code: error.status, message: error.message};
		meta.developer_message = error;
	} else if (error.statusCode === 400 && !error.message.includes('limit')) {
		const code = error.statusCode;
		meta.status_code = code;
		meta.error = {code, message: error.message};
	} else {
		let code = 500;
		meta.status_code = code;
		meta.error = {
			code: code,
			message: 'A problem with our server, please try again later'
		};
		meta.developer_message = error;
	}
	if (`${config.get('NODE_ENV')}` !== 'production') {
		console.log('error >>>>>>>>>>>>>>> ', error);
	}
	console.log('meta ', meta);
	return res.status(meta.status_code || 500).json({meta});
};

module.exports = errorHandler;