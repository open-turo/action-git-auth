import * as core from "@actions/core"

import { run } from "./cleanup.js"

try {
    await run()
} catch (error) {
    core.setFailed(error.message)
}
