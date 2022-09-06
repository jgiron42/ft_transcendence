import { DataSource } from "typeorm";
import { config } from "@config/db.config";

export default new DataSource({ ...config, type: "postgres" });
