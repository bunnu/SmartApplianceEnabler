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

import {ApplianceInfo} from './appliance-info';
import {ApplianceHeader} from './appliance-header';

export class ApplianceFactory {

  static createEmptyAppliance(): ApplianceInfo {
    return new ApplianceInfo();
  }

  static toApplianceHeaderFromJSON(rawApplianceHeader: any): ApplianceHeader {
    console.log('ApplianceHeader (JSON)' + JSON.stringify(rawApplianceHeader));
    const applianceHeader = new ApplianceHeader();
    applianceHeader.id = rawApplianceHeader.id;
    applianceHeader.name = rawApplianceHeader.name;
    applianceHeader.vendor = rawApplianceHeader.vendor;
    applianceHeader.type = rawApplianceHeader.type;
    applianceHeader.controllable = rawApplianceHeader.controllable;
    console.log('ApplianceHeader (TYPE)' + JSON.stringify(applianceHeader));
    return applianceHeader;
  }

  static toApplianceInfoFromJSON(applianceInfo: any): ApplianceInfo {
    console.log('ApplianceInfo (JSON)' + JSON.stringify(applianceInfo));
    const appliance = new ApplianceInfo();
    appliance.id = applianceInfo.id;
    appliance.name = applianceInfo.name;
    appliance.vendor = applianceInfo.vendor;
    appliance.serial = applianceInfo.serial;
    appliance.type = applianceInfo.type;

    appliance.maxPowerConsumption = applianceInfo.maxPowerConsumption;
    appliance.currentPowerMethod = applianceInfo.currentPowerMethod;
    appliance.interruptionsAllowed = applianceInfo.interruptionsAllowed;

    console.log('ApplianceInfo (TYPE)' + JSON.stringify(appliance));
    return appliance;
  }

  static toJSONfromApplianceInfo(appliance: ApplianceInfo): String {
    return JSON.stringify(appliance);
  }
}
