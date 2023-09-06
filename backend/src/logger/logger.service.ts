import { type LoggerService } from '@nestjs/common'

export class Logger implements LoggerService {
  public log (message: any, ...optionalParams: any[]): void {
    console.log(JSON.stringify({
      type: 'NESTJS_LOG',
      message,
      extra: optionalParams,
      date: new Date()
    }))
  }

  public error (message: any, ...optionalParams: any[]): void {
    console.log(JSON.stringify({
      type: 'ERROR_LOG',
      message,
      extra: optionalParams,
      date: new Date()
    }))
  }

  public warn (message: any, ...optionalParams: any[]): void {
    console.log(JSON.stringify({
      type: 'WARNING_LOG',
      message,
      extra: optionalParams,
      date: new Date()
    }))
  }

  public debug? (message: any, ...optionalParams: any[]): void {
    console.log(JSON.stringify({
      type: 'NESTJS_DEBUG_LOG',
      message,
      extra: optionalParams,
      date: new Date()
    }))
  }

  public verbose? (message: any, ...optionalParams: any[]): void {
    console.log(JSON.stringify({
      type: 'NESTJS_VERBOSE_LOG',
      message,
      extra: optionalParams,
      date: new Date()
    }))
  }
}
