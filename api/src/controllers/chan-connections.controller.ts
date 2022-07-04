import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Put,
	UseFilters,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { ChanConnectionService } from "@services/chan_connection.service";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { getPutPipeline } from "@utils/getPutPipeline";
import { ChanConnection } from "@entities/chan_connection.entity";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { PaginationInterceptor } from "@interceptors/pagination.interceptor";
import { GetUser } from "@utils/get-user";
import { User } from "@entities/user.entity";

@Controller("connections")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor, PaginationInterceptor)
@UseFilters(TypeormErrorFilter)
export class ChanConnectionsController {
	constructor(private chanConnectionService: ChanConnectionService) {}

	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
		return this.chanConnectionService.getQuery().see_connection(user.id).getOne(id);
	}

	@Put(":id")
	async update(
		@Param("id", ParseIntPipe) id: number,
		@MyRequestPipe(...getPutPipeline(ChanConnection)) chanConnection: ChanConnection,
		@GetUser() user: User,
	) {
		await this.chanConnectionService.getQuery().connection_chan_owner(user.id).update(id, chanConnection);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
		return this.chanConnectionService.getQuery().connection_owner(user.id).remove(id);
	}
}
