export interface ILogger{
    log();
    logWarning( message: string );
    logErr( message: string );
};