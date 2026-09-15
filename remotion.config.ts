import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");
Config.setVideoImageFormat("png");
Config.setCodec("h264");
Config.setCrf(18);
