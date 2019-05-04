import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IProductCategory } from 'app/shared/model/product-category.model';
import { ProductCategoryService } from './product-category.service';

@Component({
    selector: 'jhi-product-category-update',
    templateUrl: './product-category-update.component.html'
})
export class ProductCategoryUpdateComponent implements OnInit {
    productCategory: IProductCategory;
    isSaving: boolean;

    constructor(protected productCategoryService: ProductCategoryService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productCategory }) => {
            this.productCategory = productCategory;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.productCategory.id !== undefined) {
            this.subscribeToSaveResponse(this.productCategoryService.update(this.productCategory));
        } else {
            this.subscribeToSaveResponse(this.productCategoryService.create(this.productCategory));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductCategory>>) {
        result.subscribe((res: HttpResponse<IProductCategory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
