import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpWriteComponent} from './http-write.component';
import {ControlValueName} from '../control/control-value-name';
import {By} from '@angular/platform-browser';
import {
  createComponentAndConfigure,
  importsFormsAndTranslate,
  providersLoggingAndFormGroupDirective
} from '../shared/test-util';

@Component({
  template: `<app-http-write (remove)="onHttpWriteRemove()" [translationKeys]="['dummy']"></app-http-write>`
})
class HttpWriteTestHostComponent {
  onHttpWriteRemoveCalled: boolean;

  onHttpWriteRemove() {
    this.onHttpWriteRemoveCalled = true;
  }
}

@Component({selector: 'app-http-write-value', template: ''})
class HttpWriteValueStubComponent {
}

describe('HttpWriteComponent', () => {

  describe('Bindings', () => {
    let component: HttpWriteTestHostComponent;
    let fixture: ComponentFixture<HttpWriteTestHostComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [HttpWriteComponent, HttpWriteTestHostComponent],
        imports: importsFormsAndTranslate(),
        providers: providersLoggingAndFormGroupDirective(),
        schemas: [NO_ERRORS_SCHEMA]
      });
      fixture = createComponentAndConfigure(HttpWriteTestHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should handle "remove" event', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // console.log('HTML=', fixture.debugElement.nativeElement.innerHTML);
        const removeButton = fixture.debugElement.query(By.css('.buttonRemoveHttpWrite'));
        removeButton.nativeElement.click();
        expect(component.onHttpWriteRemoveCalled).toBeTruthy();
      });
    });

  });


  describe('Component', () => {
    let component: HttpWriteComponent;
    let fixture: ComponentFixture<HttpWriteComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          HttpWriteComponent,
          HttpWriteValueStubComponent,
        ],
        imports: importsFormsAndTranslate(),
        providers: providersLoggingAndFormGroupDirective(),
        schemas: [NO_ERRORS_SCHEMA]
      });
      fixture = createComponentAndConfigure(HttpWriteComponent);
      component = fixture.componentInstance;

      component.formHandler.markLabelsRequired = jest.fn();
      component.translationKeys = ['ControlHttpComponent.On', 'ControlHttpComponent.Off'];
      component.formControlNamePrefix = 'write';

      fixture.detectChanges();

      component.httpWrite.writeValues[0].name = ControlValueName.On;
      component.translationPrefix = 'ControlHttpComponent.';

      // fixture.detectChanges();
      // fixture.whenStable().then(() => {
      //   console.log('HTML=', fixture.debugElement.nativeElement.innerHTML);
      // });
    }));

    describe('Initially', () => {

      it('a HttpWrite exists', () => {
        expect(component.httpWrite).toBeTruthy();
      });

      it('the HttpWrite contains one HttpWriteValue', async(() => {
        expect(component.httpWrite.writeValues.length).toBe(1);
      }));

    });

    describe('URL field', () => {
      let url: DebugElement;
      let urlNE: any;

      beforeEach(() => {
        url = fixture.debugElement.query(By.css('input[ng-reflect-name="writeUrl"]'));
        urlNE = url.nativeElement;
      });

      it('exists', () => {
        expect(url).toBeTruthy();
      });

      // FIXME: find from input via parent
      it('has label', () => {
        expect(fixture.debugElement.query(By.css('label'))).toBeTruthy();
      });

      it('with valid URL should make the form valid', () => {
        const inputValue = 'http://web.de';
        urlNE.value = inputValue;
        urlNE.dispatchEvent(new Event('input'));
        expect(component.form.controls['writeUrl'].value).toBe(inputValue);
        expect(component.form.valid).toBeTruthy();
      });

      it('with invalid URL should make the form invalid', () => {
        const inputValue = 'http:web.de';
        urlNE.value = inputValue;
        urlNE.dispatchEvent(new Event('input'));
        expect(component.form.controls['writeUrl'].value).toBe(inputValue);
        expect(component.form.valid).toBeFalsy();
      });

      it('with invalid URL should display an error message', () => {
        const inputValue = 'http:web.de';
        urlNE.value = inputValue;
        urlNE.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const error = fixture.debugElement.query(By.css('div.negative'));
          expect(error.nativeElement.innerHTML).toBe('Die URL muss gültig sein');
        });
      });
    });

  });

});
