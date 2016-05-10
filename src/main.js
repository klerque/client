import yamljs from 'yamljs';
import * as fs from 'fs';
import chalk from 'chalk';
import {execFile} from 'child_process';

const configFile = process.cwd() + '/.klerque.yaml';

// Try reading the config file.
try {
    fs.accessSync(configFile, fs.R_OK);
} catch (err) {
    console.error(chalk.red('Can not read .klerque.yaml file!'));
    process.exit(1);
}

// Parse the config file.
const klerqueConfig = yamljs.load(configFile);

// For every item in the 'run' section, execute it.
for (const runItem in klerqueConfig.run) {
    console.log(chalk.green('Running ')+chalk.yellow(runItem));
    execFile(klerqueConfig.run[runItem].script, klerqueConfig.run[runItem].arguments, (error, stdout, stderr) => {
        console.log(stdout);

        if (error) {
            console.log(chalk.red(error));

            if (klerqueConfig.hasOwnProperty('stopOnFailure') && klerqueConfig.stopOnFailure === true) {
                console.log(chalk.red('Exiting Klerque because of a failure. All other processes are terminated.'));
                process.exit(1);
            }
        }
    })
}