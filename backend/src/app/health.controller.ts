import { Controller, Get } from '@nestjs/common'
import { ResBody } from '../types'

@Controller('/healthz')
export class HealthController {
  @Get()
  public getHealth (): ResBody<{ magic: string }> {
    return {
      success: true,
      body: {
        magic: 'think-manhandle-refrain-ought-sincerity'
      }
    }
  }
}
