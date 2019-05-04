import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IShipment } from 'app/shared/model/invoice/shipment.model';
import { ShipmentService } from './shipment.service';
import { IInvoice } from 'app/shared/model/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/invoice';

@Component({
    selector: 'jhi-shipment-update',
    templateUrl: './shipment-update.component.html'
})
export class ShipmentUpdateComponent implements OnInit {
    shipment: IShipment;
    isSaving: boolean;

    invoices: IInvoice[];
    date: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected shipmentService: ShipmentService,
        protected invoiceService: InvoiceService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ shipment }) => {
            this.shipment = shipment;
            this.date = this.shipment.date != null ? this.shipment.date.format(DATE_TIME_FORMAT) : null;
        });
        this.invoiceService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IInvoice[]>) => mayBeOk.ok),
                map((response: HttpResponse<IInvoice[]>) => response.body)
            )
            .subscribe((res: IInvoice[]) => (this.invoices = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.shipment.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.shipment.id !== undefined) {
            this.subscribeToSaveResponse(this.shipmentService.update(this.shipment));
        } else {
            this.subscribeToSaveResponse(this.shipmentService.create(this.shipment));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShipment>>) {
        result.subscribe((res: HttpResponse<IShipment>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackInvoiceById(index: number, item: IInvoice) {
        return item.id;
    }
}
