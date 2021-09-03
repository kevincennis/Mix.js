module.exports = {
	'env': {
		'browser': true,
		'es6': true,
	},
	'parserOptions': {
		'sourceType': 'module',
	},
	'rules': {
		'max-len': ['error', { 'code': 90 }],
		'quotes': ['error', 'single'],
		'eqeqeq': 'error',
		'camelcase': 'error',
		'no-eq-null': 'error',
		'curly': 'error',
		'indent': ['error', 'tab'],
		'new-cap': 'error'
	}
}