import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BUSINESS_CONSTANTS } from '../constants';

export class GeolocationDto {
  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers',
    minimum: 0,
    maximum: BUSINESS_CONSTANTS.LOCATION.MAX_SEARCH_RADIUS_KM,
    default: BUSINESS_CONSTANTS.LOCATION.DEFAULT_SEARCH_RADIUS_KM,
  })
  @IsNumber()
  @Min(0)
  @Max(BUSINESS_CONSTANTS.LOCATION.MAX_SEARCH_RADIUS_KM)
  @Type(() => Number)
  @IsOptional()
  radius?: number = BUSINESS_CONSTANTS.LOCATION.DEFAULT_SEARCH_RADIUS_KM;
}
