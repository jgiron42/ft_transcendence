import { DefaultValuePipe, ParseIntPipe, Query } from "@nestjs/common";
import { RangeValidatorPipe } from "@pipes/range-validator.pipe";
import config from "@config/api.config";

export const PerPage = () =>
	Query(
		"per_page",
		new DefaultValuePipe(config.itemPerPage),
		ParseIntPipe,
		new RangeValidatorPipe(1, config.maxItemPerPage),
	);
