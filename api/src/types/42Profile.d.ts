/**
 * 42 profile as returned by passport-42
 */
export declare type ftProfile = {
	id: string;
	username: string;
	displayname: string;
	name: {
		familyName: string;
		givenName: string;
	};
	profileUrl: string;
	emails: {
		0: {
			value: string;
		};
	};
	phoneNumbers: {
		0: {
			value: string;
		};
	};
	photos: {
		0: {
			value: string;
		};
	};
	_json: {
		usual_first_name: string;
	};
};
