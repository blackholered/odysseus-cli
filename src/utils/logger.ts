import chalk from 'chalk';

export const logger = {
    info: (message: string, ...args: any[]) => console.log(chalk.blue(`[INFO]: ${message}`), ...args),
    success: (message: string, ...args: any[]) => console.log(chalk.green(`[SUCCESS]: ${message}`), ...args),
    error: (message: string, ...args: any[]) => console.error(chalk.red(`[ERROR]: ${message}`), ...args),
    warning: (message: string, ...args: any[]) => console.warn(chalk.dim(`[WARNING]: ${message}`), ...args),
    debug: (message: string, ...args: any[]) => console.warn(chalk.grey(`[DEBUG]: ${message}`), ...args),
};
