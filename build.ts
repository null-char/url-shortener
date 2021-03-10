/**
 * Remove old files, copy front-end ones.
 */
import fs from "fs-extra";
import Logger from "jet-logger";
import childProcess from "child_process";

// Setup logger
const logger = new Logger();
logger.timestamp = false;

(async () => {
    try {
        // Remove current build
        await remove("./dist/");
        // Copy front-end files
        await copy("./src/public", "./dist/public");
        // Copy back-end files
        await exec("tsc --build tsconfig.prod.json", "./");
        await move("./dist/src/*", "./dist/");
        await copy("./src/pre-start/env", "./dist/pre-start/env");
        await remove("./dist/src");
    } catch (err) {
        logger.err(err);
    }
})();

function move(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
        return childProcess.exec(`mv ${src} ${dest}`, (err, stdout, stderr) => {
            if (!!stdout) {
                logger.info(stdout);
            }
            if (!!stderr) {
                logger.warn(stderr);
            }
            return !!err ? rej(err) : res();
        });
    });
}

function remove(loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.remove(loc, (err) => {
            return !!err ? rej(err) : res();
        });
    });
}

function copy(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.copy(src, dest, (err) => {
            return !!err ? rej(err) : res();
        });
    });
}

function exec(cmd: string, loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
            if (!!stdout) {
                logger.info(stdout);
            }
            if (!!stderr) {
                logger.warn(stderr);
            }
            return !!err ? rej(err) : res();
        });
    });
}
