import * as core from "@actions/core"
import { run } from "./cleanup.js"

run().catch((error) => core.setFailed(error.message))
