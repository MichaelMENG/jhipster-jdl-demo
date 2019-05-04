import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { OrderItemService } from './order-item.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';
import { IProductOrder } from 'app/shared/model/product-order.model';
import { ProductOrderService } from 'app/entities/product-order';

@Component({
    selector: 'jhi-order-item-update',
    templateUrl: './order-item-update.component.html'
})
export class OrderItemUpdateComponent implements OnInit {
    orderItem: IOrderItem;
    isSaving: boolean;

    products: IProduct[];

    productorders: IProductOrder[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected orderItemService: OrderItemService,
        protected productService: ProductService,
        protected productOrderService: ProductOrderService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ orderItem }) => {
            this.orderItem = orderItem;
        });
        this.productService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProduct[]>) => response.body)
            )
            .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.productOrderService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductOrder[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductOrder[]>) => response.body)
            )
            .subscribe((res: IProductOrder[]) => (this.productorders = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.orderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.orderItemService.update(this.orderItem));
        } else {
            this.subscribeToSaveResponse(this.orderItemService.create(this.orderItem));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>) {
        result.subscribe((res: HttpResponse<IOrderItem>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackProductById(index: number, item: IProduct) {
        return item.id;
    }

    trackProductOrderById(index: number, item: IProductOrder) {
        return item.id;
    }
}
