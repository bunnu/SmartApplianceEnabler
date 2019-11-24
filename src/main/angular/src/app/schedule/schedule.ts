/*
Copyright (C) 2017 Axel Müller <axel.mueller@avanux.de>

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

import {DayTimeframe} from '../schedule-timeframe-day/day-timeframe';
import {ConsecutiveDaysTimeframe} from '../schedule-timeframe-consecutivedays/consecutive-days-timeframe';
import {RuntimeRequest} from '../schedule-request-runtime/runtime-request';
import {EnergyRequest} from '../schedule-request-energy/energy-request';
import {SocRequest} from '../schedule-request-soc/soc-request';

export class Schedule {
  '@class' = 'de.avanux.smartapplianceenabler.schedule.Schedule';
  enabled: boolean;
  request: RuntimeRequest | EnergyRequest | SocRequest;
  timeframe: DayTimeframe | ConsecutiveDaysTimeframe;

  public constructor(init?: Partial<Schedule>) {
    Object.assign(this, init);
  }
}
