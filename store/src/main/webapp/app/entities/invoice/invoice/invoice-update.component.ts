import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IInvoice } from 'app/shared/model/invoice/invoice.model';
import { InvoiceService } from './invoice.service';

@Component({
    selector: 'jhi-invoice-update',
    templateUrl: './invoice-update.component.html'
})
export class InvoiceUpdateComponent implements OnInit {
    invoice: IInvoice;
    isSaving: boolean;
    date: string;
    paymentDate: string;

    constructor(protected invoiceService: InvoiceService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ invoice }) => {
            this.invoice = invoice;
            this.date = this.invoice.date != null ? this.invoice.date.format(DATE_TIME_FORMAT) : null;
            this.paymentDate = this.invoice.paymentDate != null ? this.invoice.paymentDate.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.invoice.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        this.invoice.paymentDate = this.paymentDate != null ? moment(this.paymentDate, DATE_TIME_FORMAT) : null;
        if (this.invoice.id !== undefined) {
            this.subscribeToSaveResponse(this.invoiceService.update(this.invoice));
        } else {
            this.subscribeToSaveResponse(this.invoiceService.create(this.invoice));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoice>>) {
        result.subscribe((res: HttpResponse<IInvoice>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
