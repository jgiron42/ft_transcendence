import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Put,
	Req,
	UseFilters,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { ChanConnectionService } from "@services/chan_connection.service";
import { Request } from "@src/types/request";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { getPutPipeline } from "@utils/getPutPipeline";
import { ChanConnection } from "@entities/chan_connection.entity";
import { QueryFailedFilter } from "@filters/query-failed.filter";
import { EntityNotFoundFilter } from "@filters/entity-not-found.filter";

@Controller("connections")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
@UseFilters(QueryFailedFilter, EntityNotFoundFilter)
export class ChanConnectionsController {
	constructor(private chanConnectionService: ChanConnectionService) {}

	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		return this.chanConnectionService.getQuery().see_connection(req.user.id).getOne(id);
	}

	@Put(":id")
	update(
		@Param("id", ParseIntPipe) id: number,
		@MyRequestPipe(...getPutPipeline(ChanConnection)) chanConnection: ChanConnection,
		@Req() req: Request,
	) {
		return this.chanConnectionService.getQuery().connection_chan_owner(req.user.id).update(id, chanConnection);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		return this.chanConnectionService.getQuery().connection_owner(req.user.id).remove(id);
	}
}
