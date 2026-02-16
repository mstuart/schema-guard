function getBaseType(type) {
	if (type.endsWith('[]')) {
		return type.slice(0, -2);
	}

	if (type.endsWith('?')) {
		return type.slice(0, -1);
	}

	return type;
}

function checkType(value, type) {
	const isOptional = type.endsWith('?');
	const isArray = type.endsWith('[]');
	const baseType = getBaseType(type);

	if (isOptional && (value === undefined || value === null)) {
		return true;
	}

	if (isArray) {
		if (!Array.isArray(value)) {
			return false;
		}

		if (baseType === 'array') {
			return true;
		}

		return value.every(item => typeof item === baseType);
	}

	if (baseType === 'array') {
		return Array.isArray(value);
	}

	if (baseType === 'object') {
		return typeof value === 'object' && value !== null && !Array.isArray(value);
	}

	return typeof value === baseType;
}

export default function schemaGuard(schema) {
	const entries = Object.entries(schema);

	return value => {
		if (value === null || value === undefined || typeof value !== 'object') {
			return false;
		}

		for (const [key, type] of entries) {
			if (!checkType(value[key], type)) {
				return false;
			}
		}

		return true;
	};
}
