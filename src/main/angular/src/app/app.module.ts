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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ApplianceService} from './appliance/appliance.service';
import {ApplianceComponent} from './appliance/appliance.component';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './not-found.component';
import {MeterComponent} from './meter/meter.component';
import {ControlComponent} from './control/control.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {SettingsComponent} from './settings/settings.component';
import {ApplianceResolver} from './appliance/appliance-resolver.service';
import {AppliancesReloadService} from './appliance/appliances-reload-service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {StatusComponent} from './status/status.component';
import {StatusEditComponent} from './status-edit/status-edit.component';
import {StatusEvchargerEditComponent} from './status-evcharger-edit/status-evcharger-edit.component';
import {ControlService} from './control/control-service';
import {MeterService} from './meter/meter-service';
import {ScheduleService} from './schedule/schedule-service';
import {SettingsService} from './settings/settings-service';
import {SuiModule} from 'ng2-semantic-ui';
import {ControlResolver} from './control/control-resolver.service';
import {MeterResolver} from './meter/meter-resolver.service';
import {MeterDefaultsResolver} from './meter/meter-defaults-resolver.service';
import {ControlDefaultsResolver} from './control/control-defaults-resolver.service';
import {ScheduleResolver} from './schedule/schedule-resolver.service';
import {SettingsResolver} from './settings/settings-resolver.service';
import {SettingsDefaultsResolver} from './settings/settings-defaults-resolver.service';
import {DialogService} from './shared/dialog.service';
import {CanDeactivateGuard} from './shared/can-deactivate-guard.service';
import {ErrorInterceptor} from './shared/http-error-interceptor';
import {StatusService} from './status/status.service';
import {Logger, Options} from './log/logger';
import {Level} from './log/level';
import {StatusEvchargerViewComponent} from './status-evcharger-view/status-evcharger-view.component';
import {StatusViewComponent} from './status-view/status-view.component';
import {ControlEvchargerComponent} from './control-evcharger/control-evcharger.component';
import {ControlSwitchComponent} from './control-switch/control-switch.component';
import {ControlStartingcurrentComponent} from './control-startingcurrent/control-startingcurrent.component';
import {ControlModbusComponent} from './control-modbus/control-modbus.component';
import {ControlHttpComponent} from './control-http/control-http.component';
import {ElectricVehicleResolver} from './control-evcharger/electric-vehicle-resolver.service';
import {MeterModbusComponent} from './meter-modbus/meter-modbus.component';
import {MeterHttpComponent} from './meter-http/meter-http.component';
import {MeterS0Component} from './meter-s0/meter-s0.component';
import {HttpReadComponent} from './http-read/http-read.component';
import {HttpReadValueComponent} from './http-read-value/http-read-value.component';
import {ControlEvchargerModbusComponent} from './control-evcharger-modbus/control-evcharger-modbus.component';
import {ControlEvchargerHttpComponent} from './control-evcharger-http/control-evcharger-http.component';
import {HttpWriteComponent} from './http-write/http-write.component';
import {HttpWriteValueComponent} from './http-write-value/http-write-value.component';
import {HttpConfigurationComponent} from './http-configuration/http-configuration.component';
import {ElectricVehicleComponent} from './electric-vehicle/electric-vehicle.component';
import {ModbusReadComponent} from './modbus-read/modbus-read.component';
import {ModbusReadValueComponent} from './modbus-read-value/modbus-read-value.component';
import {ModbusWriteComponent} from './modbus-write/modbus-write.component';
import {ModbusWriteValueComponent} from './modbus-write-value/modbus-write-value.component';
import { ScheduleTimeframeConsecutivedaysComponent } from './schedule-timeframe-consecutivedays/schedule-timeframe-consecutivedays.component';
import { ScheduleTimeframeDayComponent } from './schedule-timeframe-day/schedule-timeframe-day.component';
import { ScheduleRequestRuntimeComponent } from './schedule-request-runtime/schedule-request-runtime.component';
import { ScheduleRequestEnergyComponent } from './schedule-request-energy/schedule-request-energy.component';
import { ScheduleRequestSocComponent } from './schedule-request-soc/schedule-request-soc.component';
import {SchedulesComponent} from './schedules/schedules.component';

@NgModule({
  declarations: [
    AppComponent,
    ApplianceComponent,
    ControlComponent,
    ControlEvchargerComponent,
    ControlEvchargerHttpComponent,
    ControlEvchargerModbusComponent,
    ControlHttpComponent,
    ControlModbusComponent,
    ControlSwitchComponent,
    ControlStartingcurrentComponent,
    ElectricVehicleComponent,
    HttpConfigurationComponent,
    HttpReadComponent,
    HttpReadValueComponent,
    HttpWriteComponent,
    HttpWriteValueComponent,
    MeterComponent,
    MeterModbusComponent,
    MeterHttpComponent,
    MeterS0Component,
    ModbusReadComponent,
    ModbusReadValueComponent,
    ModbusWriteComponent,
    ModbusWriteValueComponent,
    PageNotFoundComponent,
    ScheduleComponent,
    SchedulesComponent,
    ScheduleRequestRuntimeComponent,
    ScheduleRequestEnergyComponent,
    ScheduleRequestSocComponent,
    ScheduleTimeframeConsecutivedaysComponent,
    ScheduleTimeframeDayComponent,
    SettingsComponent,
    StatusComponent,
    StatusEditComponent,
    StatusEvchargerEditComponent,
    StatusEvchargerViewComponent,
    StatusViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    ApplianceService,
    AppliancesReloadService,
    ApplianceResolver,
    CanDeactivateGuard,
    ControlService,
    ControlResolver,
    ControlDefaultsResolver,
    DialogService,
    ElectricVehicleResolver,
    Logger,
    {provide: Options, useValue: {level: Level.DEBUG}},
    MeterService,
    MeterResolver,
    MeterDefaultsResolver,
    ScheduleService,
    ScheduleResolver,
    SettingsService,
    SettingsResolver,
    SettingsDefaultsResolver,
    StatusService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

