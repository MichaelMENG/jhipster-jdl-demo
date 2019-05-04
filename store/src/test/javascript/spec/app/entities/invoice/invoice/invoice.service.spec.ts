/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { InvoiceService } from 'app/entities/invoice/invoice/invoice.service';
import { IInvoice, Invoice, InvoiceStatus, PaymentMethod } from 'app/shared/model/invoice/invoice.model';

describe('Service Tests', () => {
    describe('Invoice Service', () => {
        let injector: TestBed;
        let service: InvoiceService;
        let httpMock: HttpTestingController;
        let elemDefault: IInvoice;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(InvoiceService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Invoice(0, 'AAAAAAA', currentDate, 'AAAAAAA', InvoiceStatus.PAID, PaymentMethod.CREDIT_CARD, currentDate, 0);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        date: currentDate.format(DATE_TIME_FORMAT),
                        paymentDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Invoice', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        date: currentDate.format(DATE_TIME_FORMAT),
                        paymentDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        date: currentDate,
                        paymentDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Invoice(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Invoice', async () => {
                const returnedFromService = Object.assign(
                    {
                        code: 'BBBBBB',
                        date: currentDate.format(DATE_TIME_FORMAT),
                        details: 'BBBBBB',
                        status: 'BBBBBB',
                        paymentMethod: 'BBBBBB',
                        paymentDate: currentDate.format(DATE_TIME_FORMAT),
                        paymentAmount: 1
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        date: currentDate,
                        paymentDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Invoice', async () => {
                const returnedFromService = Object.assign(
                    {
                        code: 'BBBBBB',
                        date: currentDate.format(DATE_TIME_FORMAT),
                        details: 'BBBBBB',
                        status: 'BBBBBB',
                        paymentMethod: 'BBBBBB',
                        paymentDate: currentDate.format(DATE_TIME_FORMAT),
                        paymentAmount: 1
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        date: currentDate,
                        paymentDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a Invoice', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
