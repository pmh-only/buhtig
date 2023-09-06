import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { type Response } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  public canActivate (context: ExecutionContext): boolean {
    const response = context.switchToHttp().getResponse<Response>()

    if (response.locals.userId === undefined) {
      throw new ForbiddenException({
        success: false,
        message: 'you must be loggined'
      })
    }

    return true
  }
}
