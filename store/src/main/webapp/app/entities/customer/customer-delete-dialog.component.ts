import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICustomer } from 'app/shared/model/customer.model';
import { CustomerService } from './customer.service';

@Component({
    selector: 'jhi-customer-delete-dialog',
    templateUrl: './customer-delete-dialog.component.html'
})
export class CustomerDeleteDialogComponent {
    customer: ICustomer;

    constructor(protected customerService: CustomerService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.customerService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'customerListModification',
                content: 'Deleted an customer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-customer-delete-popup',
    template: ''
})
export class CustomerDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ customer }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CustomerDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.customer = customer;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/customer', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/customer', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
